CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE actions (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255),
    event_type VARCHAR(255),
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reactions (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    action_id UUID REFERENCES actions(id),
    service_name VARCHAR(255),
    execution_endpoint VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    executed_at TIMESTAMP DEFAULT NULL
);
