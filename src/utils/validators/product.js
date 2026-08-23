export function validateCreateProduct(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: ["Product data is required"],
    };
  }

  if (!data.name || !String(data.name).trim()) {
    errors.push("name is required");
  }

  if (
    data.price === undefined ||
    data.price === null ||
    isNaN(Number(data.price))
  ) {
    errors.push("price is required and must be a valid number");
  }

  if (!data.catgory || !String(data.catgory).trim()) {
    errors.push("catgory is required");
  }

  if (!data.description || !String(data.description).trim()) {
    errors.push("description is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateGetRestaurantProducts(data) {
  const errors = [];

  if (
    data.restaurantId !== undefined &&
    (!data.restaurantId || typeof data.restaurantId !== "string")
  ) {
    errors.push("restaurantId must be a valid string");
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
