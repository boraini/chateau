-- SCHEMA: public

-- DROP SCHEMA IF EXISTS public ;

CREATE DATABASE "chateau-local-test"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United Kingdom.1252'
    LC_CTYPE = 'English_United Kingdom.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS CommentParent;
DROP TABLE IF EXISTS CommentAuthor;

CREATE TABLE Post (
	id SERIAL PRIMARY KEY,
    PostID text
);

CREATE TABLE Comment (
	id SERIAL PRIMARY KEY,
    PostID int,
	Author int,
    "Date" date,
    Content text
);

CREATE TABLE CommentParent (
	id SERIAL PRIMARY KEY,
	ChildID int
);

CREATE TABLE CommentAuthor (
	id SERIAL PRIMARY KEY,
	Email VARCHAR(255) NOT NULL,
	DisplayName text NOT NULL
);