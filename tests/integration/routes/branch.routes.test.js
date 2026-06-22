import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import { initTestDatabase, resetTestDatabase, closeTestDatabase } from "../../helpers/db.helper.js";
import { restaurantSignupPayload } from "../../fixtures/users.fixture.js";
import { Restaurant } from "../../../src/models/index.js";
import { generateToken } from "../../../src/middlewares/tokens.js";

describe("Integration: Branch Routes", () => {
  let restaurantToken;
  let userToken;
  let restaurant;

  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();

    await request(app)
      .post("/auth/restaurants/signup")
      .send(restaurantSignupPayload);

    restaurant = await Restaurant.findOne({
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

    restaurantToken = loginResponse.body.data.token;
    userToken = generateToken(restaurant.id, restaurant.businessEmail, "user");
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates a branch address", async () => {
    const response = await request(app)
      .post("/branch/create-branch-address")
      .set("Authorization", `Bearer ${restaurantToken}`)
      .send({
        address: "123 Test Street",
        lat: 30.0,
        lng: 31.0,
        phone: "+201234567890",
      })
      .expect(201);

    expect(response.body.success).to.be.true;
    expect(response.body.data).to.have.property("address", "123 Test Street");
    expect(response.body.data).to.have.property("restaurantId", restaurant.id);
  });

  it("returns the nearest branch for a user", async () => {
    const createResponse = await request(app)
      .post("/branch/create-branch-address")
      .set("Authorization", `Bearer ${restaurantToken}`)
      .send({
        address: "123 Test Street",
        lat: 30.0,
        lng: 31.0,
        phone: "+201234567890",
      });

    expect(createResponse.status).to.equal(201);

    const nearestResponse = await request(app)
      .get("/branch/nearest-branch")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ lat: 30.0, lng: 31.0 })
      .expect(200);

    expect(nearestResponse.body.success).to.be.true;
    expect(nearestResponse.body.data).to.have.property("address", "123 Test Street");
  });

  it("deletes a branch address", async () => {
    const createResponse = await request(app)
      .post("/branch/create-branch-address")
      .set("Authorization", `Bearer ${restaurantToken}`)
      .send({
        address: "123 Test Street",
        lat: 30.0,
        lng: 31.0,
        phone: "+201234567890",
      });

    const branchId = createResponse.body.data.id;

    const deleteResponse = await request(app)
      .delete("/branch/delete-branch")
      .set("Authorization", `Bearer ${restaurantToken}`)
      .query({ id: branchId })
      .expect(200);

    expect(deleteResponse.body.success).to.be.true;
    expect(deleteResponse.body.data).to.have.property(
      "message",
      "Branch deleted successfully",
    );
  });
});
