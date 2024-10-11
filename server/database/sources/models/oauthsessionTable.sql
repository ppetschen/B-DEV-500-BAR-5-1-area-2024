CREATE TABLE IF NOT EXISTS oauth_sessions (
    id INT PRIMARY KEY DEFAULT 1,
    code_verifier VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()  
);
