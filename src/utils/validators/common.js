export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  return PHONE_REGEX.test(phone.replace(/\s/g, ""));
}

export function hasPasswordComplexity(password) {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  return hasLetters && hasNumbers;
}

export function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (password.length > 100) {
    errors.push("Password must not exceed 100 characters");
  }

  if (!hasPasswordComplexity(password)) {
    errors.push("Password should contain letters and numbers");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRequired(data, fields) {
  const errors = [];

  fields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && !data[field].trim())
    ) {
      errors.push(`${field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeEmail(email) {
  return typeof email === "string" ? email.trim() : email;
}

export function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str.toLowerCase().trim();
}
