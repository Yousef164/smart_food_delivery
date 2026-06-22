/**
 * Response Formatter Class
 * Centralized response formatting for all endpoints
 */

export class ResponseFormatter {

  static success(statusCode = 200, message = "Success", data = null) {
    return {
      success: true,
      statusCode,
      message,
      ...(data && { data }),
    };
  }

  /**
   * Error response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Array of error details
   * @returns {Object} Formatted error response
   */
  static error(statusCode = 500, message = "Error", errors = []) {
    return {
      success: false,
      statusCode,
      message,
      ...(errors.length > 0 && { errors }),
    };
  }

  /**
   * Paginated response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Array} data - Response data
   * @param {number} total - Total items count
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {Object} Formatted paginated response
   */
  static paginated(
    statusCode = 200,
    message = "Success",
    data = [],
    total = 0,
    page = 1,
    limit = 10,
  ) {
    return {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
