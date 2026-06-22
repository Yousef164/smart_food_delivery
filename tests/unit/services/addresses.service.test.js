import { AddressService } from "../../../src/modules/Addresses/addresses.service.js";
import * as Models from "../../../src/models/index.js";
import { Validator } from "../../../src/utils/Validator.js";
import * as tokens from "../../../src/middlewares/tokens.js";
import { ApiError } from "../../../src/middlewares/errorHandler.js";

describe("Unit: AddressService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("addAddress throws when user role is not 'user'", async () => {
    jest.spyOn(tokens, "isUser").mockReturnValue(false);

    await expect(AddressService.addAddress({}, { id: "u1" })).rejects.toThrow(
      "error role",
    );
  });

  test("addAddress throws when validation fails", async () => {
    jest.spyOn(tokens, "isUser").mockReturnValue(true);
    jest
      .spyOn(Validator, "validateAddress")
      .mockReturnValue({ isValid: false, errors: ["bad"] });

    await expect(
      AddressService.addAddress({ lat: 1 }, { id: "u1" }),
    ).rejects.toThrow("Validation failed");
  });

  test("addAddress creates address when data is valid", async () => {
    jest.spyOn(tokens, "isUser").mockReturnValue(true);
    jest
      .spyOn(Validator, "validateAddress")
      .mockReturnValue({ isValid: true, errors: [] });

    const created = {
      id: "a1",
      userId: "u1",
      lat: 30,
      lng: 31,
      fullAddress: "Home",
    };
    jest.spyOn(Models.Address, "create").mockResolvedValue(created);

    const result = await AddressService.addAddress(
      { lat: 30, lng: 31, fullAddress: "Home" },
      { id: "u1" },
    );
    expect(result).toEqual(created);
  });

  test("getAddress throws when id not provided", async () => {
    await expect(AddressService.getAddress(null, { id: "u1" })).rejects.toThrow(
      "this address is not exist",
    );
  });

  test("getAddress throws when not found", async () => {
    jest.spyOn(Models.Address, "findOne").mockResolvedValue(null);

    await expect(
      AddressService.getAddress("nope", { id: "u1" }),
    ).rejects.toThrow("Address not found");
  });

  test("getAddress returns address when found", async () => {
    const addr = { id: "a1", userId: "u1" };
    jest.spyOn(Models.Address, "findOne").mockResolvedValue(addr);

    const res = await AddressService.getAddress("a1", { id: "u1" });
    expect(res).toEqual({ address: addr });
  });

  test("getAllAddresses throws when role invalid", async () => {
    jest.spyOn(tokens, "isUser").mockReturnValue(false);

    await expect(AddressService.getAllAddresses({ id: "u1" })).rejects.toThrow(
      "role error",
    );
  });

  test("getAllAddresses returns addresses when role valid", async () => {
    jest.spyOn(tokens, "isUser").mockReturnValue(true);
    const addrs = [{ id: "a1" }];
    jest.spyOn(Models.Address, "findAll").mockResolvedValue(addrs);

    const res = await AddressService.getAllAddresses({ id: "u1" });
    expect(res).toEqual({ addresses: addrs });
  });

  test("deleteAddress throws when id not provided", async () => {
    await expect(
      AddressService.deleteAddress(null, { id: "u1" }),
    ).rejects.toThrow("this address is not exist");
  });

  test("deleteAddress throws when address not found", async () => {
    jest.spyOn(Models.Address, "findOne").mockResolvedValue(null);

    await expect(
      AddressService.deleteAddress("a1", { id: "u1" }),
    ).rejects.toThrow("Address not found");
  });

  test("deleteAddress destroys and returns message when found", async () => {
    const addr = { id: "a1", destroy: jest.fn().mockResolvedValue() };
    jest.spyOn(Models.Address, "findOne").mockResolvedValue(addr);

    const res = await AddressService.deleteAddress("a1", { id: "u1" });
    expect(addr.destroy).toHaveBeenCalled();
    expect(res).toEqual({ message: "Address deleted successfully✅" });
  });
});
