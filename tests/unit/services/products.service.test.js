import { expect } from "chai";
import { ProductsService } from "../../../src/modules/products/products.service.js";
import { Restaurant } from "../../../src/models/index.js";
import { ApiError } from "../../../src/middlewares/errorHandler.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import {
  restaurantSignupPayload,
  productPayload,
} from "../../fixtures/users.fixture.js";

describe("Products Service", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates a product for a restaurant", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const result = await ProductsService.createProduct(productPayload, {
      id: restaurant.id,
      role: "restaurant",
    });

    expect(result).to.be.an("object");
    expect(result.name).to.equal(productPayload.name);
    expect(result.price).to.equal(productPayload.price);
    expect(result.restaurantId).to.equal(restaurant.id);
  });

  it("retrieves a created product by id", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const createdProduct = await ProductsService.createProduct(productPayload, {
      id: restaurant.id,
      role: "restaurant",
    });

    const result = await ProductsService.getProduct(createdProduct.id);
    expect(result).to.be.an("object");
    expect(result.name).to.equal(productPayload.name);
  });

  it("throws when requesting a missing product", async () => {
    try {
      await ProductsService.getProduct("00000000-0000-0000-0000-000000000000");
      expect.fail("Expected getProduct to throw for missing id");
    } catch (error) {
      expect(error).to.be.instanceOf(ApiError);
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal("Product not found");
    }
  });

  it("updates a product for the owning restaurant", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const createdProduct = await ProductsService.createProduct(productPayload, {
      id: restaurant.id,
      role: "restaurant",
    });

    const updatedProduct = await ProductsService.updateProduct(
      { id: createdProduct.id, name: "Updated Pizza" },
      { id: restaurant.id, role: "restaurant" },
    );

    expect(updatedProduct).to.be.an("object");
    expect(updatedProduct.name).to.equal("Updated Pizza");
  });

  it("retrieves products for a restaurant", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const secondRestaurant = await Restaurant.create({
      ownerName: "Mona",
      restaurantName: "Sweet Treats",
      businessEmail: "mona@example.com",
      password: "Secure123",
      emailToken: "test-token-2",
      verifyEmail: true,
    });

    await ProductsService.createProduct(productPayload, {
      id: restaurant.id,
      role: "restaurant",
    });

    const otherProductPayload = {
      ...productPayload,
      name: "Candy Cake",
      catgory: "Desserts",
      businessEmail: undefined,
    };

    await ProductsService.createProduct(otherProductPayload, {
      id: secondRestaurant.id,
      role: "restaurant",
    });

    const result = await ProductsService.getProductRestaurant(
      { restaurantId: secondRestaurant.id },
      { id: restaurant.id, role: "user" },
    );

    expect(result).to.be.an("object");
    expect(result.products).to.be.an("array");
    expect(result.total).to.equal(1);
    expect(result.products[0].restaurantId).to.equal(secondRestaurant.id);
  });
});
