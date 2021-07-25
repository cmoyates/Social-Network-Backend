CREATE DATABASE socialnetwork;

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    likes SMALLINT NOT NULL
);