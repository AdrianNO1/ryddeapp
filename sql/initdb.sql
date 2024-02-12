CREATE TABLE IF NOT EXISTS parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deleted_at DATETIME,
    name TEXT NOT NULL,
    pfp BLOB,
    role TEXT,
    datejoined DATETIME,
    age INT,
    ip TEXT,
    password TEXT NOT NULL, -- as a hash ofc
    salt TEXT NOT NULL, -- password salt
    host INTEGER, -- the family host
    FOREIGN KEY (host) REFERENCES parents(id)
);

CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deleted_at DATETIME,
    name TEXT NOT NULL,
    pfp BLOB,
    role TEXT,
    points INT,
    datejoined DATETIME,
    age INT,
    ip TEXT,
    password TEXT, -- as a hash ofc
    salt TEXT, -- password salt
    host INTEGER, -- the family host
    linking_code INTEGER,
    FOREIGN KEY (host) REFERENCES parents(id)
    FOREIGN KEY (linking_code) REFERENCES linking_codes(id)
);

CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deleted_at DATETIME,
    title TEXT NOT NULL,
    reward TEXT,
    reward_points INT,
    icon BLOB
);

CREATE TABLE IF NOT EXISTS task_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deleted_at DATETIME,
    title TEXT NOT NULL,
    description TEXT,
    created DATETIME,
    schedule TEXT, -- for repeated tasks. E.g "025" assigns the task to be completed monday, wednesday, and saturday
    time TIME, -- for the schedule
    duration INT, -- the duration after the task is assigned untill it expires (in seconds). if null never expires
    max_tasks INT DEFAULT 1, -- how many instances of this task can be assigned to each child at once from the routine
    reward_points INT,
    enabled BOOLEAN,
    creator INTEGER NOT NULL,
    reward INTEGER NOT NULL,
    FOREIGN KEY (creator) REFERENCES parents(id), 
    FOREIGN KEY (reward) REFERENCES rewards(id) -- custom reward that is not points
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deleted_at DATETIME,
    created_at DATETIME,
    assigned DATETIME,
    status TEXT, -- assigned, completed, or expired
    template INTEGER NOT NULL,
    assigned_child INTEGER NOT NULL,
    FOREIGN KEY (template) REFERENCES task_templates(id),
    FOREIGN KEY (assigned_child) REFERENCES children(id)
);

CREATE TABLE IF NOT EXISTS linking_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expiry_datetime DATETIME NOT NULL,
    code INT
);