-- Micro-Task Market Database Schema
-- PostgreSQL compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'worker', -- worker, poster, manager, admin
    lga VARCHAR(100),
    neighbourhood VARCHAR(100),
    trusted BOOLEAN DEFAULT FALSE,
    completed_count INTEGER DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0.00,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OTPs table for verification
CREATE TABLE otps (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pay DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'single', -- single, applications
    proof_required BOOLEAN DEFAULT TRUE,
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, reserved, completed, paid, disputed, cancelled
    poster_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    escrow_id UUID,
    escrow_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    reserved_at TIMESTAMP,
    completed_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications table (for application mode tasks)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note TEXT,
    distance DECIMAL(5,2) DEFAULT 0, -- in km
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Proofs table (task completion evidence)
CREATE TABLE proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID UNIQUE NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'photo', -- photo, voice, code
    before_image_url VARCHAR(500),
    after_image_url VARCHAR(500),
    voice_note_url VARCHAR(500),
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Escrow table (for high-value tasks)
CREATE TABLE escrow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID UNIQUE NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    poster_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    proof_image_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'held', -- held, released, refunded
    created_at TIMESTAMP DEFAULT NOW(),
    released_at TIMESTAMP
);

-- Resolutions table (disputes and manager actions)
CREATE TABLE resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, resolved
    resolution VARCHAR(20), -- paid, partial, rework, cancelled
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Audit logs table (manager and admin actions)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_poster_id ON tasks(poster_id);
CREATE INDEX idx_tasks_worker_id ON tasks(worker_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_applications_task_id ON applications(task_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add foreign key for escrow_id in tasks table
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_escrow_id FOREIGN KEY (escrow_id) REFERENCES escrow(id) ON DELETE SET NULL;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data will be inserted via seed script