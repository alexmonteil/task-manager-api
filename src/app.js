const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


// create app and configure port
const app = express();


// set up middleware and routers
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;