const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, userTwo, userTwoId, taskOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);


test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test"
        })
        .expect(201);


        // Assert task was added to DB
        const task = await Task.findById(response.body._id);
        expect(task).not.toBeNull();
        expect(task.completed).toEqual(false);
});


test("Should get tasks for authenticated user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

        // Assert that response only contains 2 tasks
        expect(response.body.length).toEqual(4);
});


test("Should not delete other users tasks", async () => {
    
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    // Assert task still exists in DB
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});


test("Should not create task with invalid description/completed", async () => {
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 42,
            completed: "Hello"
        })
        .expect(500);
});


test("Should not update task with invalid description/completed", async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 42,
            completed: "hello"
        })
        .expect(500);
});


test("Should delete user task", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert task was removed from DB
    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
});


test("Should not delete task if unauthenticated", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401);
});


test("Should not update other users tasks", async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: "Not first task anymore",
            completed: false
        })
        .expect(404);

    // Assert task was not modified in DB
    const task = await Task.findById(taskOne._id);
    expect(task.description).toEqual(taskOne.description);
});


test("Should fetch user task by id", async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    
    // Assert task was retrieved from DB
    expect(response.body.description).toEqual(taskOne.description);    
});


test("Should not fetch user task by id if unauthenticated", async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401);
});


test("Should not fetch other users task by id", async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
});


test("Should fetch only completed tasks", async () => {
    const response = await request(app)
        .get("/tasks?completed=true")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert only completed tasks fetched
    response.body.forEach(task => expect(task.completed).toEqual(true));
});


test("Should fetch only incomplete tasks", async () => {
    const response = await request(app)
        .get("/tasks?completed=false")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert only incomplete tasks fetched
    response.body.forEach(task => expect(task.completed).toEqual(false));
});


test("Should sort tasks by completed status", async () => {
    const response = await request(app)
        .get("/tasks?sortBy=completed:asc")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert tasks are sorted from false to true
    expect(response.body[0].completed).toEqual(false);
    expect(response.body[1].completed).toEqual(true);
});


test("Should fetch page of tasks", async () => {
    const response = await request(app)
        .get("/tasks?limit=3")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    
    // Assert response only contained 3 tasks
    expect(response.body.length).toEqual(3);
});


