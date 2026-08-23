import { ResponseFormatter } from "./ResponseFormatter.js";



export class BaseController {

  static sendSuccess(res, statusCode = 200, message = "Success", data = null) {
    const response = ResponseFormatter.success(statusCode, message, data);
    res.status(statusCode).json(response);
  }


  static sendError(res, statusCode = 500, message = "Error", errors = []) {
    const response = ResponseFormatter.error(statusCode, message, errors);
    res.status(statusCode).json(response);
  }

  static sendPaginated(
    res,
    data = [],
    total = 0,
    page = 1,
    limit = 10,
    message = "Success",
  ) {
    const response = ResponseFormatter.paginated(
      200,
      message,
      data,
      total,
      page,
      limit,
    );
    res.status(200).json(response);
  }
}
