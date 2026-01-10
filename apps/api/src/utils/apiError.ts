class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown[];
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error: unknown[] = [],
    stack?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.success = false
    this.errors = error

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default ApiError;
