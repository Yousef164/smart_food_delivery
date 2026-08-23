import { expect } from "chai";
import AuthService from "../../../src/modules/restaurants/restaurant.service.js";
import { Restaurant } from "../../../src/models/index.js";
import { ApiError } from "../../../src/middlewares/errorHandler.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { restaurantSignupPayload } from "../../fixtures/users.fixture.js";

describe("Restaurant Auth Service", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("signs up a new restaurant", async () => {
    const result = await AuthService.signup(restaurantSignupPayload);

    expect(result.restaurantData).to.be.an("object");
    expect(result.restaurantData.businessEmail).to.equal(
      restaurantSignupPayload.businessEmail,
    );
    expect(result.restaurantData).to.not.have.property("password");
  });

  it("verifies email and allows restaurant login", async () => {
    await AuthService.signup(restaurantSignupPayload);

    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });

    const verifyResult = await AuthService.verifyEmail(restaurant.emailToken);
    expect(verifyResult).to.have.property(
      "message",
      "Email verified successfully",
    );

    const loginResult = await AuthService.login({
      email: restaurantSignupPayload.businessEmail,
      password: restaurantSignupPayload.password,
    });

    expect(loginResult).to.have.property("token");
    expect(loginResult.restaurant).to.be.an("object");
    expect(loginResult.restaurant.businessEmail).to.equal(
      restaurantSignupPayload.businessEmail,
    );
  });

  it("returns a restaurant profile by id", async () => {
    await AuthService.signup(restaurantSignupPayload);
    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });
    await AuthService.verifyEmail(restaurant.emailToken);

    const profile = await AuthService.getRestaurantProfile(restaurant.id);
    expect(profile).to.be.an("object");
    expect(profile.restaurantName).to.equal(
      restaurantSignupPayload.restaurantName.toLowerCase(),
    );
  });

  it("updates restaurant profile data", async () => {
    await AuthService.signup(restaurantSignupPayload);
    const restaurant = await Restaurant.findOne({
      where: { businessEmail: restaurantSignupPayload.businessEmail },
    });
    await AuthService.verifyEmail(restaurant.emailToken);

    const updatedProfile = await AuthService.updateRestaurantProfile(
      restaurant.id,
      { restaurantName: "Better Bites" },
    );

    expect(updatedProfile).to.be.an("object");
    expect(updatedProfile.restaurantName).to.equal("better bites");
  });

  it("searches restaurants by query", async () => {
    await AuthService.signup(restaurantSignupPayload);

    const secondRestaurant = {
      owner: "Search Owner",
      restaurantName: "Search Bites",
      description: "A place to search",
      businessEmail: "search@example.com",
      password: "Password123!",
    };

    await AuthService.signup(secondRestaurant);

    const result = await AuthService.searchRestaurant(
      { query: "Search" },
      { role: "user" },
    );

    expect(result).to.be.an("object");
    expect(result.restaurants).to.be.an("array");
    expect(result.total).to.equal(1);
    expect(result.restaurants[0].businessEmail).to.equal(
      secondRestaurant.businessEmail,
    );
  });

  it("does not allow duplicate restaurant email signups", async () => {
    await AuthService.signup(restaurantSignupPayload);

    try {
      await AuthService.signup(restaurantSignupPayload);
      expect.fail("Expected duplicate signup to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(ApiError);
      expect(error.statusCode).to.equal(409);
      expect(error.message).to.equal(
        "This restaurant with this email already exists",
      );
    }
  });
});
