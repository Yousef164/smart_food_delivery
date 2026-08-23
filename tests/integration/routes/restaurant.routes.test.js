import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { restaurantSignupPayload } from "../../fixtures/users.fixture.js";
import { Restaurant } from "../../../src/models/index.js";

describe("Integration: Restaurant Auth Routes", () => {
  let token;

  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("should signup a restaurant", async () => {
    const response = await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload)
      .expect(201);

    expect(response.body.success).to.be.true;
    expect(response.body.data.restaurantData).to.include({
      ownerName: "salah",
      restaurantName: "tasty bites",
      businessEmail: "owner@example.com",
    });
  });

  it("should login a restaurant", async () => {
    // First signup
    await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload);

    // Verify email
    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });
    await request(app)
      .get("/auth/restaurants/verify-email")
      .query({ token: restaurant.emailToken })
      .expect(200);

    const loginResponse = await request(app)
      .post("/auth/restaurants/login")
      .send({
        email: restaurantSignupPayload.businessEmail,
        password: restaurantSignupPayload.password,
      })
      .expect(200);

    expect(loginResponse.body.success).to.be.true;
    expect(loginResponse.body.data).to.have.property("token");
    token = loginResponse.body.data.token;
  });

  it("should get restaurant profile", async () => {
    // Signup and verify
    await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload);

    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });
    await request(app)
      .get("/auth/restaurants/verify-email")
      .query({ token: restaurant.emailToken });

    const loginResponse = await request(app)
      .post("/auth/restaurants/login")
      .send({
        email: restaurantSignupPayload.businessEmail,
        password: restaurantSignupPayload.password,
      });

    token = loginResponse.body.data.token;

    const profileResponse = await request(app)
      .get("/auth/restaurants/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.success).to.be.true;
    expect(profileResponse.body.data).to.have.property(
      "restaurantName",
      "tasty bites",
    );
  });

  it("should update restaurant profile", async () => {
    // Signup and verify
    await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload);

    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });
    await request(app)
      .get("/auth/restaurants/verify-email")
      .query({ token: restaurant.emailToken });

    const loginResponse = await request(app)
      .post("/auth/restaurants/login")
      .send({
        email: restaurantSignupPayload.businessEmail,
        password: restaurantSignupPayload.password,
      });

    token = loginResponse.body.data.token;

    const updateResponse = await request(app)
      .patch("/auth/restaurants/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" })
      .expect(200);

    expect(updateResponse.body.success).to.be.true;
    expect(updateResponse.body.message).to.equal(
      "Profile updated successfully✅",
    );
  });
});
