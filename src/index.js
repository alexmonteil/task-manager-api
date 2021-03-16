const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


// create app and configure port
const app = express();
const port = process.env.PORT;


// set up middleware and routers
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



// Confirm server status
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


