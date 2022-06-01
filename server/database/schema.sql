CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email varchar(255) NOT NULL UNIQUE,
    username varchar(255) DEFAULT NULL,
    password varchar(255) NOT NULL,
    role varchar(10) DEFAULT 'user' NOT NULL,
    verified tinyint(1) DEFAULT 0 NOT NULL,
    enabled tinyint(1) DEFAULT 1 NOT NULL,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS apikey (
    user_id INTEGER(10) NOT NULL,
    api varchar(255) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE IF NOT EXISTS verification_token (
    user_id INTEGER PRIMARY KEY,
    token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user (id)
);