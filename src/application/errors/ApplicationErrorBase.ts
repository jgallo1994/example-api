export abstract class ApplicationErrorBase extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ApplicationErrorBase.prototype);
  }

  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
