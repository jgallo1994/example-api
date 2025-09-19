export interface HttpResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
  path: string;
}

export class HttpResponse {
  static success<T>(
    data: T,
    message: string = 'Operation completed successfully',
    path: string = '/'
  ): HttpResponseData<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static error(
    message: string,
    error?: string,
    path: string = '/'
  ): HttpResponseData {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
    path: string = '/'
  ): HttpResponseData<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static notFound(
    message: string = 'Resource not found',
    path: string = '/'
  ): HttpResponseData {
    return {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static validationError(
    message: string = 'Validation failed',
    error?: string,
    path: string = '/'
  ): HttpResponseData {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
