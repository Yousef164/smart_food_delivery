import * as common from "./common.js";

export function validateCreateCart(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["productId", "quantity", "price"],
  );

  if (!reqValid) {
    errors.push(...reqErrors);
  }

  if (
    data.quantity === undefined ||
    Number.isNaN(Number(data.quantity)) ||
    Number(data.quantity) <= 0 ||
    !Number.isInteger(Number(data.quantity))
  ) {
    errors.push("quantity must be a positive integer");
  }

  if (
    data.price === undefined ||
    Number.isNaN(Number(data.price)) ||
    Number(data.price) <= 0
  ) {
    errors.push("price must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateCart(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: ["Cart update data is required"],
    };
  }

  if (!data.id || !String(data.id).trim()) {
    errors.push("id is required");
  }

  if (data.quantity !== undefined) {
    if (
      Number.isNaN(Number(data.quantity)) ||
      Number(data.quantity) <= 0 ||
      !Number.isInteger(Number(data.quantity))
    ) {
      errors.push("quantity must be a positive integer");
    }
  }

  if (data.price !== undefined) {
    if (Number.isNaN(Number(data.price)) || Number(data.price) <= 0) {
      errors.push("price must be a positive number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
