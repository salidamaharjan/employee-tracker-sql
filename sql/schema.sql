DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE IF NOT EXISTS employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE IF NOT EXISTS department(
    id INT NOT NULL PRIMARY KEY, 
    name VARCHAR(30) NOT NULL
);