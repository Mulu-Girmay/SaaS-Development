let token;
let noteId;
const request = require("supertest");
const app = require("../index")

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@example.com",
      password: "123456",
    });

  token = res.body.token;
});

it("should create a note", async () => {
  const res = await request(app)
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Test Note",
      content: "Hello world",
    });

  expect(res.statusCode).toBe(201);
  noteId = res.body._id;
});

it("should block unauthorized access", async () => {
  const res = await request(app).get(`/api/notes/${noteId}`);
  expect(res.statusCode).toBe(401);
});
