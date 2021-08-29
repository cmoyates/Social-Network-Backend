CREATE DATABASE socialnetwork;

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_name TEXT NOT NULL,
    user_img TEXT NOT NULL,
    content TEXT NOT NULL,
    likes SMALLINT [],
    comments JSON NOT NULL
);

CREATE TABLE profiles(
    profile_id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    img_url TEXT NOT NULL,
    profiles_following SMALLINT [],
    primary_color TEXT,
    dark_mode BOOLEAN NOT NULL
);

CREATE TABLE chats(
    chat_id SERIAL PRIMARY KEY,
    room_name TEXT NOT NULL,
    participants JSON [],
    messages JSON NOT NULL
);