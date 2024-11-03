CREATE TABLE IF NOT EXISTS google_mail_history (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    history_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()  
);
