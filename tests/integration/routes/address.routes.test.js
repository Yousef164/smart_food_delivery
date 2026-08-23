import request from "supertest";
import { expect } from "chai";
import app from "../../../src/app.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { userSignupPayload } from "../../fixtures/users.fixture.js";
import { User } from "../../../src/models/index.js";

describe("Integration: Address Routes", () => {
  let user;
  let userToken;

  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates, retrieves, lists, and deletes a user address", async () => {
    // signup user
    const signupResponse = await request(app)
      .post("/auth/users/user/signup")
      .send(userSignupPayload)
      .expect(201);

    expect(signupResponse.body.success).to.be.true;

    // find user and verify email
    user = await User.findOne({ where: { email: userSignupPayload.email } });
    await request(app)
      .get("/auth/users/verify-email")
      .query({ token: user.emailToken })
      .expect(200);

    // login
    const loginResponse = await request(app)
      .post("/auth/users/user/login")
      .send({
        email: userSignupPayload.email,
        password: userSignupPayload.password,
      })
      .expect(200);

    expect(loginResponse.body.success).to.be.true;
    userToken = loginResponse.body.data.token;

    // create address
    const createResponse = await request(app)
      .post("/address/add-address")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ fullAddress: "123 Home Street", lat: 30.0, lng: 31.0 })
      .expect(201);

    expect(createResponse.body.success).to.be.true;
    expect(createResponse.body.data).to.have.property(
      "fullAddress",
      "123 Home Street",
    );
    expect(createResponse.body.data).to.have.property("userId", user.id);

    const addressId = createResponse.body.data.id;

    // get all addresses
    const allResponse = await request(app)
      .get("/address/get-all-addresses")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(allResponse.body.success).to.be.true;
    expect(allResponse.body.data.addresses).to.be.an("array");
    expect(allResponse.body.data.addresses[0]).to.have.property(
      "fullAddress",
      "123 Home Street",
    );

    // get single address
    const getResponse = await request(app)
      .get("/address/get-address")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ id: addressId })
      .expect(200);

    expect(getResponse.body.success).to.be.true;
    expect(getResponse.body.data.address).to.have.property(
      "fullAddress",
      "123 Home Street",
    );

    // delete address
    const deleteResponse = await request(app)
      .delete("/address/delete-address")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ id: addressId })
      .expect(200);

    expect(deleteResponse.body.success).to.be.true;
    expect(deleteResponse.body.data).to.have.property(
      "message",
      "Address deleted successfully✅",
    );
  });
});
