import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import {
  restaurantSignupPayload,
  productPayload,
} from "../../fixtures/users.fixture.js";
import { Restaurant } from "../../../src/models/index.js";

describe("Integration: Product Routes", () => {
  let token;
  let productId;

  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    // Signup and login restaurant to get token
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
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product/create-product")
      .set("Authorization", `Bearer ${token}`)
      .send(productPayload)
      .expect(201);

    expect(response.body.success).to.be.true;
    expect(response.body.data).to.include({
      name: productPayload.name,
      price: productPayload.price,
    });
    productId = response.body.data.id;
  });

  it("should get a product", async () => {
    // First create a product
    const createResponse = await request(app)
      .post("/product/create-product")
      .set("Authorization", `Bearer ${token}`)
      .send(productPayload);

    productId = createResponse.body.data.id;

    const getResponse = await request(app)
      .get("/product/get-product")
      .set("Authorization", `Bearer ${token}`)
      .query({ id: productId })
      .expect(200);

    expect(getResponse.body.success).to.be.true;
    expect(getResponse.body.data.name).to.equal(productPayload.name);
  });

  it("should update a product", async () => {
    // First create a product
    const createResponse = await request(app)
      .post("/product/create-product")
      .set("Authorization", `Bearer ${token}`)
      .send(productPayload);

    productId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .patch("/product/update-product")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: productId, name: "Updated Pizza" })
      .expect(200);

    expect(updateResponse.body.success).to.be.true;
    expect(updateResponse.body.data.name).to.equal("Updated Pizza");
  });
});
