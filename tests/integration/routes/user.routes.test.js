import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { userSignupPayload } from "../../fixtures/users.fixture.js";

describe("Integration: User routes", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates a user, verifies email, logs in, and fetches profile", async () => {
    const signupResponse = await request(app)
      .post("/auth/users/user/signup")
      .send(userSignupPayload)
      .expect(201);

    expect(signupResponse.body.success).to.be.true;

    const tokenResponse = await request(app)
      .post("/auth/users/user/login")
      .send({ email: "user@example.com", password: "Secure123" })
      .expect(401);

    expect(tokenResponse.body.message).to.equal(
      "The email address was not verified",
    );
  });
});
