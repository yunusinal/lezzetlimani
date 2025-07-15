package logs

import (
	"fmt"
	"os"
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	Log  *zap.Logger
	once sync.Once
)

// Init, initilizes the global logger
func Init(prod bool) {
	once.Do(func() {
		// Create logs directory if it doesn't exist
		if _, err := os.Stat("logs"); os.IsNotExist(err) {
			err := os.Mkdir("logs", 0755)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to create logs directory: %v", err)
				os.Exit(1)
			}
		}

		var cfg zap.Config

		if prod {
			cfg = zap.NewProductionConfig()
			cfg.OutputPaths = []string{"stdout", "logs/auth.log"}
			cfg.ErrorOutputPaths = []string{"stderr", "logs/auth-error.log"}
		} else {
			cfg = zap.NewDevelopmentConfig()
		}

		cfg.EncoderConfig.TimeKey = "timestamp"
		cfg.EncoderConfig.MessageKey = "message"
		cfg.EncoderConfig.LevelKey = "level"
		cfg.EncoderConfig.CallerKey = "caller"
		cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
		cfg.EncoderConfig.EncodeCaller = zapcore.ShortCallerEncoder

		var err error
		Log, err = cfg.Build(zap.AddCaller(), zap.AddStacktrace(zap.ErrorLevel))
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to initialize logger: %v", err)
			os.Exit(1)
		}
	})
}

// Sync, flushes any buffered log entries
func Sync() {
	if Log != nil {
		_ = Log.Sync()
	}
}

// WithTrace, adds a trace ID to the log
func WithTrace(traceID string) *zap.Logger {
	return Log.With(zap.String("trace_id", traceID))
}
