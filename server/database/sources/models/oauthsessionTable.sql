CREATE TABLE IF NOT EXISTS oauth_sessions (
    id SERIAL PRIMARY KEY,
    code_verifier VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()  
);
