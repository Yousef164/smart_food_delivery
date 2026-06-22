import { expect } from "chai";
import bcrypt from "bcrypt";
import { Validator } from "../../../src/utils/Validator.js";
import {
  comparePassword,
  formatUserResponse,
} from "../../../src/utils/UserHelpers.js";

describe("Utilities: Validator and UserHelpers", () => {
  it("validates a correct restaurant signup payload", () => {
    const payload = {
      owner: "Salah",
      restaurantName: "Tasty Bites",
      description: "Delicious food",
      businessPhone: "+201234567890",
      businessEmail: "owner@example.com",
      password: "Secure123",
    };

    const result = Validator.validateRestaurantSignupData(payload);

    expect(result.isValid).to.be.true;
    expect(result.errors).to.be.empty;
  });

  it("rejects unsupported fields during restaurant profile update", () => {
    const result = Validator.validateRestaurantProfileUpdate({
      owner: "Ali",
      invalidField: "value",
    });

    expect(result.isValid).to.be.false;
    expect(result.errors).to.deep.equal(["invalidField cannot be updated"]);
  });

  it("compares bcrypt password hashes correctly", async () => {
    const password = "Secure123";
    const hash = await bcrypt.hash(password, 10);

    const isMatch = await comparePassword(password, hash);
    expect(isMatch).to.be.true;
  });

  it("formats user responses without sensitive fields", () => {
    const user = {
      id: "123",
      email: "owner@example.com",
      password: "hashed-password",
    };

    const formatted = formatUserResponse(user);
    expect(formatted).to.not.have.property("password");
    expect(formatted.email).to.equal("owner@example.com");
  });
});
