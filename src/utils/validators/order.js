import * as common from "./common.js";

export function validateCreateOrder(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["addressId", "totalPrice", "paymentMethod"],
  );

  if (!reqValid) {
    errors.push(...reqErrors);
  }

  const paymentMethod = String(data.paymentMethod || "").trim().toLowerCase();
  if (["card", "wallet"].includes(paymentMethod)) {
    const { isValid: billingValid, errors: billingErrors } = common.validateRequired(
      data,
      [
        "apartment",
        "floor",
        "street",
        "building",
        "city",
        "state",
        "country",
        "postal_code",
      ],
    );

    if (!billingValid) {
      errors.push(...billingErrors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
