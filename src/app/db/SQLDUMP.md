# SQLDUMP FOR MYSQL

## SCHEMA

```
CREATE SCHEMA idb;
```

## TABLES

### USERS

```
CREATE TABLE idb.users(
username varchar(50) not null,
name varchar(100) not null,
password text not null,
PRIMARY KEY(username))
```

### DETAILS

```
CREATE TABLE idb.details(
username varchar(50) not null,
income double not null, 
goal double not null, 
saved double not null, 
goal_date text not null, 
PRIMARY KEY(username))
```