TASK-MANAGER-API
================

An example of Restful API for a task management application

you can test the API with Postman at the following url:

https://monteil-task-manager.herokuapp.com


ALL AUTHENTICATED ROUTES WILL EXPECT A JWT CONTAINING THE USER ID

Demo user email: **demo@demo.com** <br>
Demo user password: **Demo123!** <br>

TASKS ROUTES:

Read tasks options (GET method), authenticated: <br>
/tasks?completed=true <br>
/tasks?limit=10&skip=20 <br>
/tasks?sortBy=createdAt:asc <br>
/tasks <br>

--------------------------------------------------

Read task (GET method), authenticated:
**/tasks/:id**

--------------------------------------------------

Update task (PATCH method), authenticated: 
**/tasks/:id**

takes an object with the following blueprint: <br>
```
{
    "description": "YourDescription"
}
```

--------------------------------------------------


Create task (POST method), authenticated:
**/tasks**

takes an object with the following blueprint: <br>
```
{
    "description": "YourDescription"
}
```
--------------------------------------------------

Delete task (DELETE method), authenticated:
**/tasks/:id**


===================================================


USERS ROUTES:

Read use profile (GET method), authenticated:
**/users/me**


--------------------------------------------------

Update user (PATCH method), authenticated:
**/users/me**

takes an object with the following blueprint: <br>
```
{
    "name": "YourName",
    "email": "YourEmail",
    "password": "YourPassword",
    "age": age (number)
}
```

--------------------------------------------------

Create user (POST method):
**/users**

takes an object with the following blueprint: <br>
```
{
    "name": "YourName",
    "email": "YourEmail",
    "password": "YourPassword",
    "age": age (number) (optional)
}
```

--------------------------------------------------

Login user (POST method):
**/users/login**


takes an object with the following blueprint: <br>
```
{
    "email": "YourEmail",
    "password": "YourPassword"
}
```
--------------------------------------------------

Logout user (POST method), authenticated:
**/users/logout**

--------------------------------------------------

Logout all sessions (POST method), authenticated:
**/users/logoutAll**


--------------------------------------------------

Delete user (DELETE method), authenticated:
**/users/me**

--------------------------------------------------

Upload avatar (POST method), authenticated:
**/users/me/avatar**

takes an object with the following blueprint: <br>
```
{
    "avatar": file
}
```
--------------------------------------------------

Delete avatar (DELETE method), authenticated:
**/users/me/avatar**

--------------------------------------------------

Fetch avatar (GET method):
**/users/:id/avatar**

