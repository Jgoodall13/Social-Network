DROP TABLE IF EXISTS social_users;

CREATE TABLE social_users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(300) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    url text,
    bio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friend_requests;

CREATE TABLE friend_requests(
    id SERIAL PRIMARY KEY,
    req_id INTEGER NOT NULL,
    rec_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
