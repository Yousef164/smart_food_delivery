import * as common from "./index.js";

export function validateAddress(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["lat", "lng", "fullAddress"],
  );

  if (!reqValid) {
    errors.push(...reqErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
