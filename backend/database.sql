CREATE TABLE complainnstu;
use complainnstu;


CREATE TABLE departments (   
    d_id VARCHAR(3) NOT NULL PRIMARY KEY,
    en_name VARCHAR(100) NOT NULL,    
    bn_name VARCHAR(200) NOT NULL,
    est INT NOT NULL,    
    shortform VARCHAR(20) NOT NULL
);

CREATE TABLE users (    uid VARCHAR(100) NOT NULL PRIMARY KEY,
    name VARCHAR(100),    
    roll VARCHAR(15),
    email VARCHAR(100),   
    mobile VARCHAR(20),
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user', 
    d_id VARCHAR(5) NOT NULL,
    batch VARCHAR(5),   
    block TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (uid) REFERENCES users(uid)

);

CREATE TABLE complains (
    c_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,    
    uid VARCHAR(100) NOT NULL,
    details MEDIUMTEXT NOT NULL,    
    docs TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,    
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Due',   
    title VARCHAR(300) NOT NULL
);

CREATE TABLE comments (    
    com_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100) NOT NULL,   
    date VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,   
    c_id INT NOT NULL,
    FOREIGN KEY (c_id) REFERENCES complains(c_id),
    FOREIGN KEY (uid) REFERENCES users(uid)
);

CREATE TABLE notifications (    
    n_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100) NOT NULL,    
    view TINYINT(1) NOT NULL DEFAULT 0,
    message VARCHAR(300) NOT NULL,   
    date VARCHAR(100) NOT NULL,
    c_id INT NULL,    
    FOREIGN KEY (c_id) REFERENCES complains(c_id),
    FOREIGN KEY (uid) REFERENCES users(uid)
);





