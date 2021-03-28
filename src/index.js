const app = require("./app");


// configure port
const port = process.env.PORT;


// Confirm server status
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


