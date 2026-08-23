import * as common from "./common.js";

export function validateSignupData(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["fullName", "email", "phone", "password"],
  );
  if (!reqValid) errors.push(...reqErrors);

  if (data.email && !common.isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (data.password) {
    const { isValid: pwValid, errors: pwErrors } = common.validatePassword(
      data.password,
    );
    if (!pwValid) errors.push(...pwErrors);
  }

  if (data.phone && !common.isValidPhone(data.phone)) {
    errors.push("Invalid phone number format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLoginData(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["email", "password"],
  );
  if (!reqValid) errors.push(...reqErrors);

  if (data.email && !common.isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateProfileUpdate(data) {
  const errors = [];
  const allowedFields = ["fullName", "phone"];

  Object.keys(data).forEach((key) => {
    if (!allowedFields.includes(key)) {
      errors.push(`${key} cannot be updated`);
    }
  });

  if (data.phone && !common.isValidPhone(data.phone)) {
    errors.push("Invalid phone number format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
