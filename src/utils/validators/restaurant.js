import * as common from "./common.js";

export function validateRestaurantSignupData(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["owner", "restaurantName", "description", "businessEmail", "password"],
  );

  if (!reqValid) errors.push(...reqErrors);

  if (data.businessEmail && !common.isValidEmail(data.businessEmail)) {
    errors.push("invalid email format");
  }

  const { isValid: pwValid, errors: pwErrors } = common.validatePassword(
    data.password,
  );
  if (!pwValid) errors.push(...pwErrors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRestaurantProfileUpdate(data) {
  const errors = [];
  const allowedFields = [
    "owner",
    "ownerName",
    "restaurantName",
    "description",
    "businessPhone",
    "isOpen",
  ];

  Object.keys(data).forEach((key) => {
    if (!allowedFields.includes(key)) {
      errors.push(`${key} cannot be updated`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateGetAllRestaurants(data) {
  const errors = [];
  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["limit", "page"],
  );

  if (!reqValid) {
    errors.push(...reqErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateSearchRestaurant(data) {
  const errors = [];
  const searchQuery = data.query || data.q || data.search;

  if (!searchQuery || typeof searchQuery !== "string" || !searchQuery.trim()) {
    errors.push("query is required");
  }

  if (data.limit !== undefined && Number.isNaN(Number(data.limit))) {
    errors.push("limit must be a number");
  }
  if (data.page !== undefined && Number.isNaN(Number(data.page))) {
    errors.push("page must be a number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
