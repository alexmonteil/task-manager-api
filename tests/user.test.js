const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");


beforeEach(setupDatabase);


test("Should sign up a new user", async () => {
    const response = await request(app).post("/users").send({
        name: "Andrew",
        email: "andrew@example.com",
        password: "MyPass777!"
    }).expect(201)

    // Assert that the database made the correct changes
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Andrew",
            email: "andrew@example.com",
        },
        token: user.tokens[0].token
    });

    // Assert that passwords are not stored in plaintext
    expect(user.password).not.toBe("MyPass777!");
});


test("Should login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    // Assert that database stores tokens
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});


test("Should not login non existent user", async () => {
    await request(app).post("/users/login").send({
        email: "nonexistent@example.com",
        password: "nonexistentpassword"
    }).expect(400);
});


test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});


test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});


test("Should delete account for user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    
    // Assert user was removed
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});


test("Should not delete account for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});


test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/philly.jpg")
        .expect(200);

        // Assert that binary data was saved
        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer));
});


test("Should update valid user fields", async () => {
    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Asriel"
        })
        .expect(200);

        // Assert that name was changed in DB
        const user = await User.findById(userOneId);
        expect(response.body.name).toBe(user.name);

});


test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Tokyo"
        })
        .expect(400);
});


test("Should not sign up user with invalid email", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "John",
            email: "notanemail.com",
            password: "alohomora55!",
            age: 27
        })
        .expect(500);
    
    // Assert user was not added to DB
    const user = await User.findOne({ name: "John" });
    expect(user).toBeNull();
});


test("Should not sign up user with invalid password", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "John",
            email: "john@example.com",
            password: "be3",
            age: 27
        })
        .expect(500);
    
    // Assert user was not added to DB
    const user = await User.findOne({ name: "John" });
    expect(user).toBeNull();
});


test("Should not update user if unauthenticated", async () => {
    await request(app)
        .patch("/users/me")
        .send({
            name: "John"
        })
        .expect(401);
});


test("Should not update user with invalid email", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: "notavalidemail.com"
        })
        .expect(500);
    
    // Assert user email was not changed
    const user = await User.findById(userOne._id);
    expect(user.email).toEqual("mike@example.com");
});


test("Should not update user with invalid password", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: "mi2"
        })
        .expect(500);
    
    // Assert user password was not changed
    await request(app)
        .post("/users/login")
        .send({
            email: "mike@example.com",
            password: "56what!!"
        })
        .expect(200);
});


test("Should not delete user if unauthenticated", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);

    // Assert user was not removed from DB
    const users = await User.find();
    expect(users.length).toEqual(2);
});