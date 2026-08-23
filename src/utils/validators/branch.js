import * as common from "./index.js";

export function validateBranchAddress(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["address", "lat", "lng"],
  );

  if (!reqValid) {
    errors.push(...reqErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateNearestBranch(data) {
  const errors = [];

  const { isValid: reqValid, errors: reqErrors } = common.validateRequired(
    data,
    ["lat", "lng"],
  );
  if (!reqValid) {
    errors.push(...reqErrors);
  }

  const lat = Number(data.lat);
  const lng = Number(data.lng);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.push("Invalid latitude");
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    errors.push("Invalid longitude");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
