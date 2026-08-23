import { expect } from "chai";
import branchesService from "../../../src/modules/branchesAddresses/branches.service.js";
import { Restaurant, BranchAddress } from "../../../src/models/index.js";
import { ApiError } from "../../../src/middlewares/errorHandler.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";

describe("Branches Service", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates a branch address for a restaurant", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const data = {
      address: "123 Test Street",
      lat: 30.0,
      lng: 31.0,
      phone: "+201234567890",
    };

    const result = await branchesService.createBranchAddress(data, {
      id: restaurant.id,
      role: "restaurant",
    });

    expect(result).to.be.an("object");
    expect(result.address).to.equal(data.address);
    expect(result.restaurantId).to.equal(restaurant.id);
  });

  it("finds the nearest branch for a user", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    await BranchAddress.create({
      restaurantId: restaurant.id,
      address: "123 Test Street",
      lat: 30.0,
      lng: 31.0,
      phone: "+201234567890",
    });

    const result = await branchesService.nearestBranch(
      { lat: 30.0, lng: 31.0 },
      { id: restaurant.id, role: "user" },
    );

    expect(result).to.be.an("object");
    expect(result).to.have.property("address", "123 Test Street");
  });

  it("deletes a branch address for the owning restaurant", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    const branch = await BranchAddress.create({
      restaurantId: restaurant.id,
      address: "123 Test Street",
      lat: 30.0,
      lng: 31.0,
      phone: "+201234567890",
    });

    const result = await branchesService.deleteBranch(
      { id: branch.id },
      { id: restaurant.id, role: "restaurant" },
    );

    expect(result).to.be.an("object");
    expect(result.message).to.equal("Branch deleted successfully");
  });

  it("throws when deleting a non-existing branch", async () => {
    const restaurant = await Restaurant.create({
      ownerName: "Salah",
      restaurantName: "Tasty Bites",
      businessEmail: "owner@example.com",
      password: "Secure123",
      emailToken: "test-token",
      verifyEmail: true,
    });

    try {
      await branchesService.deleteBranch(
        { id: "00000000-0000-0000-0000-000000000000" },
        { id: restaurant.id, role: "restaurant" },
      );
      expect.fail("Expected deleteBranch to throw for non-existent branch");
    } catch (error) {
      expect(error).to.be.instanceOf(ApiError);
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal("Branch not found");
    }
  });
});
