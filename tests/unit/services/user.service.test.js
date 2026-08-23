import { expect } from "chai";
import { AuthService } from "../../../src/modules/users/authUsers.service.js";
import {
  initTestDatabase,
  resetTestDatabase,
  closeTestDatabase,
} from "../../helpers/db.helper.js";
import { userSignupPayload } from "../../fixtures/users.fixture.js";

describe("Auth User Service", () => {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it("creates a new user and returns safe user data", async () => {
    const result = await AuthService.signup(userSignupPayload);

    expect(result.user).to.be.an("object");
    expect(result.user).to.have.property("email", "user@example.com");
    expect(result.user).to.not.have.property("password");
  });

  it("fails login before email verification", async () => {
    await AuthService.signup(userSignupPayload);

    try {
      await AuthService.login({
        email: "user@example.com",
        password: "Secure123",
      });
      expect.fail("Expected login to throw before email verification");
    } catch (error) {
      expect(error.statusCode).to.equal(401);
      expect(error.message).to.equal("The email address was not verified");
    }
  });
});
