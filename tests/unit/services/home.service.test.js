import { expect } from "chai";
import { HomeService } from "../../../src/modules/home/home.service.js";
import { Restaurant, Product } from "../../../src/models/index.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";

describe("Home Service", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("returns home page metadata", async () => {
    const result = await HomeService.getHome();

    expect(result).to.be.an("object");
    expect(result.title).to.equal("Smart Food Delivery Home");
    expect(result.routes).to.include("/home/restaurants");
  });

  it("retrieves verified restaurants for home", async () => {
    await Restaurant.create({
      ownerName: "Owner One",
      restaurantName: "Verified Restaurant",
      businessEmail: "verified@example.com",
      password: "Password123",
      emailToken: "token-1",
      verifyEmail: true,
    });

    await Restaurant.create({
      ownerName: "Owner Two",
      restaurantName: "Unverified Restaurant",
      businessEmail: "unverified@example.com",
      password: "Password123",
      emailToken: "token-2",
      verifyEmail: false,
    });

    const result = await HomeService.getHomeRestaurants({ limit: 10, page: 1 });

    expect(result).to.be.an("object");
    expect(result.restaurants).to.have.length(1);
    expect(result.total).to.equal(1);
    expect(result.restaurants[0].businessEmail).to.equal(
      "verified@example.com",
    );
  });

  it("retrieves available products for home", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Owner One",
      restaurantName: "Food House",
      businessEmail: "foodhouse@example.com",
      password: "Password123",
      emailToken: "token-3",
      verifyEmail: true,
    });

    await Product.create({
      restaurantId: restaurant.id,
      name: "Available Product",
      description: "Tasty item",
      catgory: "Food",
      image: null,
      price: 10,
      isAvailable: true,
    });

    await Product.create({
      restaurantId: restaurant.id,
      name: "Unavailable Product",
      description: "Sold out item",
      catgory: "Food",
      image: null,
      price: 15,
      isAvailable: false,
    });

    const result = await HomeService.getHomeProducts({ limit: 10, page: 1 });

    expect(result).to.be.an("object");
    expect(result.products).to.have.length(1);
    expect(result.total).to.equal(1);
    expect(result.products[0].name).to.equal("Available Product");
  });
});
