import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { restaurantSignupPayload } from "../../fixtures/users.fixture.js";

describe("Integration: Auth routes", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("signs up and logs in a restaurant via auth routes", async () => {
    const signupResponse = await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload)
      .expect(201);

    expect(signupResponse.body.success).to.be.true;
    expect(signupResponse.body.data.restaurantData).to.include({
      ownerName: "salah",
      restaurantName: "tasty bites",
      businessEmail: "owner@example.com",
    });
  });
});
