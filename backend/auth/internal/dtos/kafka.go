package dtos

type UserCreateEvent struct {
	UserID string `json:"id"`
}

type EmailEvent struct {
	Type      string            `json:"type"`
	To        string            `json:"to"`
	Subject   string            `json:"subject"`
	Template  string            `json:"template"`
	Variables map[string]string `json:"variables"`
}
