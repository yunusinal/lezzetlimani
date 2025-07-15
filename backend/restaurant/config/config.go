package config

type Config struct {
	DBConfig             DBConfig             `mapstructure:",squash"`
	ServerConfig         ServerConfig         `mapstructure:",squash"`
	MockConfig           MockConfig           `mapstructure:",squash"`
	AddressServiceConfig AddressServiceConfig `mapstructure:",squash"`
}

type DBConfig struct {
	Host     string `mapstructure:"DB_HOST"`
	Port     string `mapstructure:"DB_PORT"`
	User     string `mapstructure:"DB_USER"`
	Password string `mapstructure:"DB_PASSWORD"`
	DBName   string `mapstructure:"DB_NAME"`
}

type ServerConfig struct {
	Port string `mapstructure:"SERVER_PORT"`
}

type MockConfig struct {
	Enabled bool `mapstructure:"MOCK_ENABLED"`
}

type AddressServiceConfig struct {
	URL string `mapstructure:"ADDRESS_SERVICE_URL"`
}
