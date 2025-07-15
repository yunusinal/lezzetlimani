package logger

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"
)

type LogLevel string

const (
	DEBUG LogLevel = "DEBUG"
	INFO  LogLevel = "INFO"
	WARN  LogLevel = "WARN"
	ERROR LogLevel = "ERROR"
	FATAL LogLevel = "FATAL"
)

type LogEntry struct {
	Timestamp   time.Time              `json:"timestamp"`
	Level       LogLevel               `json:"level"`
	Service     string                 `json:"service"`
	Message     string                 `json:"message"`
	RequestID   string                 `json:"request_id,omitempty"`
	UserID      string                 `json:"user_id,omitempty"`
	Operation   string                 `json:"operation,omitempty"`
	Duration    string                 `json:"duration,omitempty"`
	StatusCode  int                    `json:"status_code,omitempty"`
	Error       string                 `json:"error,omitempty"`
	Redis       *RedisLogData          `json:"redis,omitempty"`
	Kafka       *KafkaLogData          `json:"kafka,omitempty"`
	Database    *DatabaseLogData       `json:"database,omitempty"`
	File        string                 `json:"file,omitempty"`
	Line        int                    `json:"line,omitempty"`
	Function    string                 `json:"function,omitempty"`
	Extra       map[string]interface{} `json:"extra,omitempty"`
}

type RedisLogData struct {
	Operation string        `json:"operation"`
	Key       string        `json:"key"`
	TTL       time.Duration `json:"ttl,omitempty"`
	Value     string        `json:"value,omitempty"`
}

type KafkaLogData struct {
	Operation string `json:"operation"`
	Topic     string `json:"topic"`
	Key       string `json:"key,omitempty"`
	Message   string `json:"message,omitempty"`
	Partition int32  `json:"partition,omitempty"`
	Offset    int64  `json:"offset,omitempty"`
}

type DatabaseLogData struct {
	Operation string        `json:"operation"`
	Table     string        `json:"table,omitempty"`
	Query     string        `json:"query,omitempty"`
	Duration  time.Duration `json:"duration,omitempty"`
	Rows      int64         `json:"rows,omitempty"`
}

type Logger struct {
	serviceName string
	env         string
	jsonFormat  bool
}

func New(serviceName, env string) *Logger {
	return &Logger{
		serviceName: serviceName,
		env:         env,
		jsonFormat:  env == "production",
	}
}

func (l *Logger) log(level LogLevel, message string, fields ...interface{}) {
	entry := LogEntry{
		Timestamp: time.Now().UTC(),
		Level:     level,
		Service:   l.serviceName,
		Message:   message,
	}

	// Add file, line, and function information
	if pc, file, line, ok := runtime.Caller(3); ok {
		entry.File = file
		entry.Line = line
		if fn := runtime.FuncForPC(pc); fn != nil {
			entry.Function = fn.Name()
		}
	}

	// Parse additional fields
	if len(fields) > 0 {
		if len(fields)%2 == 0 {
			entry.Extra = make(map[string]interface{})
			for i := 0; i < len(fields); i += 2 {
				key := fmt.Sprintf("%v", fields[i])
				value := fields[i+1]
				
				// Handle special field types
				switch key {
				case "request_id":
					entry.RequestID = fmt.Sprintf("%v", value)
				case "user_id":
					entry.UserID = fmt.Sprintf("%v", value)
				case "operation":
					entry.Operation = fmt.Sprintf("%v", value)
				case "duration":
					entry.Duration = fmt.Sprintf("%v", value)
				case "status_code":
					if code, ok := value.(int); ok {
						entry.StatusCode = code
					}
				case "error":
					entry.Error = fmt.Sprintf("%v", value)
				case "redis":
					if redisData, ok := value.(*RedisLogData); ok {
						entry.Redis = redisData
					}
				case "kafka":
					if kafkaData, ok := value.(*KafkaLogData); ok {
						entry.Kafka = kafkaData
					}
				case "database":
					if dbData, ok := value.(*DatabaseLogData); ok {
						entry.Database = dbData
					}
				default:
					entry.Extra[key] = value
				}
			}
		}
	}

	l.output(entry)
}

func (l *Logger) output(entry LogEntry) {
	if l.jsonFormat {
		jsonBytes, _ := json.Marshal(entry)
		fmt.Println(string(jsonBytes))
	} else {
		// Human-readable format for development
		timestamp := entry.Timestamp.Format("2006-01-02 15:04:05")
		file := ""
		if entry.File != "" {
			parts := strings.Split(entry.File, "/")
			file = fmt.Sprintf(" [%s:%d]", parts[len(parts)-1], entry.Line)
		}
		
		message := fmt.Sprintf("[%s] %s%s %s: %s", 
			timestamp, entry.Level, file, entry.Service, entry.Message)
		
		if entry.RequestID != "" {
			message += fmt.Sprintf(" [req_id=%s]", entry.RequestID)
		}
		if entry.UserID != "" {
			message += fmt.Sprintf(" [user_id=%s]", entry.UserID)
		}
		if entry.Operation != "" {
			message += fmt.Sprintf(" [op=%s]", entry.Operation)
		}
		if entry.Duration != "" {
			message += fmt.Sprintf(" [duration=%s]", entry.Duration)
		}
		if entry.Error != "" {
			message += fmt.Sprintf(" [error=%s]", entry.Error)
		}
		
		fmt.Println(message)
	}
}

func (l *Logger) Debug(message string, fields ...interface{}) {
	l.log(DEBUG, message, fields...)
}

func (l *Logger) Info(message string, fields ...interface{}) {
	l.log(INFO, message, fields...)
}

func (l *Logger) Warn(message string, fields ...interface{}) {
	l.log(WARN, message, fields...)
}

func (l *Logger) Error(message string, fields ...interface{}) {
	l.log(ERROR, message, fields...)
}

func (l *Logger) Fatal(message string, fields ...interface{}) {
	l.log(FATAL, message, fields...)
	os.Exit(1)
}

// Context-aware logging
func (l *Logger) WithContext(ctx context.Context) *ContextLogger {
	return &ContextLogger{
		logger: l,
		ctx:    ctx,
	}
}

type ContextLogger struct {
	logger *Logger
	ctx    context.Context
}

func (cl *ContextLogger) extractFromContext() []interface{} {
	var fields []interface{}
	
	if requestID := cl.ctx.Value("request_id"); requestID != nil {
		fields = append(fields, "request_id", requestID)
	}
	
	if userID := cl.ctx.Value("user_id"); userID != nil {
		fields = append(fields, "user_id", userID)
	}
	
	return fields
}

func (cl *ContextLogger) Debug(message string, fields ...interface{}) {
	contextFields := cl.extractFromContext()
	allFields := append(contextFields, fields...)
	cl.logger.Debug(message, allFields...)
}

func (cl *ContextLogger) Info(message string, fields ...interface{}) {
	contextFields := cl.extractFromContext()
	allFields := append(contextFields, fields...)
	cl.logger.Info(message, allFields...)
}

func (cl *ContextLogger) Warn(message string, fields ...interface{}) {
	contextFields := cl.extractFromContext()
	allFields := append(contextFields, fields...)
	cl.logger.Warn(message, allFields...)
}

func (cl *ContextLogger) Error(message string, fields ...interface{}) {
	contextFields := cl.extractFromContext()
	allFields := append(contextFields, fields...)
	cl.logger.Error(message, allFields...)
}

func (cl *ContextLogger) Fatal(message string, fields ...interface{}) {
	contextFields := cl.extractFromContext()
	allFields := append(contextFields, fields...)
	cl.logger.Fatal(message, allFields...)
}

// Global logger instance
var defaultLogger *Logger

func Init(serviceName, env string) {
	defaultLogger = New(serviceName, env)
}

func Debug(message string, fields ...interface{}) {
	if defaultLogger != nil {
		defaultLogger.Debug(message, fields...)
	} else {
		log.Printf("[DEBUG] %s", message)
	}
}

func Info(message string, fields ...interface{}) {
	if defaultLogger != nil {
		defaultLogger.Info(message, fields...)
	} else {
		log.Printf("[INFO] %s", message)
	}
}

func Warn(message string, fields ...interface{}) {
	if defaultLogger != nil {
		defaultLogger.Warn(message, fields...)
	} else {
		log.Printf("[WARN] %s", message)
	}
}

func Error(message string, fields ...interface{}) {
	if defaultLogger != nil {
		defaultLogger.Error(message, fields...)
	} else {
		log.Printf("[ERROR] %s", message)
	}
}

func Fatal(message string, fields ...interface{}) {
	if defaultLogger != nil {
		defaultLogger.Fatal(message, fields...)
	} else {
		log.Fatalf("[FATAL] %s", message)
	}
}

func WithContext(ctx context.Context) *ContextLogger {
	if defaultLogger != nil {
		return defaultLogger.WithContext(ctx)
	}
	return nil
}