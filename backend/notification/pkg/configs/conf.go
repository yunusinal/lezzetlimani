package configs

type Config struct {
	Email  EmailConfig  `mapstructure:",squash"`
	Kafka  KafkaConfig  `mapstructure:",squash"`
	Server ServerConfig `mapstructure:",squash"`
}

type EmailConfig struct {
	Host     string `mapstructure:"email_host"`
	Port     string `mapstructure:"email_port"`
	Username string `mapstructure:"email_username"`
	Password string `mapstructure:"email_password"`
	From     string `mapstructure:"email_from"`
	Verify   string `mapstructure:"email_verify"`
}

type KafkaConfig struct {
	Brokers []string   `mapstructure:"kafka_brokers"`
	Topic   KafkaTopic `mapstructure:",squash"`
	GroupID string     `mapstructure:"kafka_group_id"`
}

type KafkaTopic struct {
	EmailEvent string `mapstructure:"kafka_topic_email_event"`
}

type ServerConfig struct {
	Port string `mapstructure:"server_port"`
}
