CREATE DATABASE roundhouse_volunteer_hub;

USE roundhouse_volunteer_hub;

CREATE TABLE staff_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteers (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(30),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE volunteer_skills (
    volunteer_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (volunteer_id, skill_id),
    FOREIGN KEY (volunteer_id)
        REFERENCES volunteers(volunteer_id)
        ON DELETE CASCADE,
    FOREIGN KEY (skill_id)
        REFERENCES skills(skill_id)
        ON DELETE CASCADE
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    event_date DATE NOT NULL,
    status ENUM('upcoming', 'completed', 'cancelled')
        DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON DELETE CASCADE
);

CREATE TABLE shift_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    shift_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id)
        REFERENCES shifts(shift_id)
        ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id)
        REFERENCES volunteers(volunteer_id)
        ON DELETE CASCADE,
    UNIQUE (shift_id, volunteer_id)
);

CREATE TABLE volunteer_hours (
    hours_id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id INT NOT NULL,
    shift_id INT,
    hours_date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (volunteer_id)
        REFERENCES volunteers(volunteer_id)
        ON DELETE CASCADE,
    FOREIGN KEY (shift_id)
        REFERENCES shifts(shift_id)
        ON DELETE SET NULL
);

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by)
        REFERENCES staff_users(user_id)
        ON DELETE SET NULL
);