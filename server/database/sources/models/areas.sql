CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255),
    event_type VARCHAR(255),
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    owner_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
    service_name VARCHAR(255),
    execution_endpoint VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    executed_at TIMESTAMP DEFAULT NULL
);
