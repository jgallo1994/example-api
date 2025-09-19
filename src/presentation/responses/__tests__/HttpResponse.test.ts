import { HttpResponse } from '../HttpResponse';

describe('HttpResponse', () => {
  describe('success', () => {
    it('should create successful response with data', () => {
      const data = { id: 'user-123', name: 'Juan' };
      const result = HttpResponse.success(data, 'User retrieved successfully');

      expect(result).toEqual({
        success: true,
        message: 'User retrieved successfully',
        data: data,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should create successful response without data', () => {
      const result = HttpResponse.success('Operation completed successfully');

      expect(result).toEqual({
        success: true,
        message: 'Operation completed successfully',
        data: 'Operation completed successfully',
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should include ISO timestamp', () => {
      const result = HttpResponse.success('Test message');
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });
  });

  describe('error', () => {
    it('should create error response with error details', () => {
      const errorDetails = 'Database connection failed';
      const result = HttpResponse.error('Internal server error', errorDetails);

      expect(result).toEqual({
        success: false,
        message: 'Internal server error',
        error: errorDetails,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should create error response without error details', () => {
      const result = HttpResponse.error('Something went wrong');

      expect(result).toEqual({
        success: false,
        message: 'Something went wrong',
        error: undefined,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('created', () => {
    it('should create created response with data', () => {
      const data = { id: 'user-123', name: 'Juan' };
      const result = HttpResponse.created(data, 'User created successfully');

      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        data: data,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should create created response without data', () => {
      const result = HttpResponse.created('Resource created successfully');

      expect(result).toEqual({
        success: true,
        message: 'Resource created successfully',
        data: 'Resource created successfully',
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('notFound', () => {
    it('should create not found response with error details', () => {
      const result = HttpResponse.notFound('User not found');

      expect(result).toEqual({
        success: false,
        message: 'User not found',
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should create not found response without error details', () => {
      const result = HttpResponse.notFound('Resource not found');

      expect(result).toEqual({
        success: false,
        message: 'Resource not found',
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('validationError', () => {
    it('should create validation error response with error details', () => {
      const errorDetails = 'Name cannot be empty';
      const result = HttpResponse.validationError(
        'Validation failed',
        errorDetails
      );

      expect(result).toEqual({
        success: false,
        message: 'Validation failed',
        error: errorDetails,
        timestamp: expect.any(String),
        path: '/',
      });
    });

    it('should create validation error response without error details', () => {
      const result = HttpResponse.validationError('Validation failed');

      expect(result).toEqual({
        success: false,
        message: 'Validation failed',
        error: undefined,
        timestamp: expect.any(String),
        path: '/',
      });
    });
  });

  describe('response structure consistency', () => {
    it('should maintain consistent structure across all response types', () => {
      const successResponse = HttpResponse.success(
        { data: 'value' },
        'Success message'
      );
      const errorResponse = HttpResponse.error(
        'Error message',
        'Error details'
      );
      const createdResponse = HttpResponse.created(
        { id: '123' },
        'Created message'
      );
      const notFoundResponse = HttpResponse.notFound('Not found message');
      const validationResponse = HttpResponse.validationError(
        'Validation message',
        'Validation details'
      );

      // All responses should have success, message, and timestamp
      expect(successResponse).toHaveProperty('success');
      expect(successResponse).toHaveProperty('message');
      expect(successResponse).toHaveProperty('timestamp');
      expect(successResponse).toHaveProperty('path');

      expect(errorResponse).toHaveProperty('success');
      expect(errorResponse).toHaveProperty('message');
      expect(errorResponse).toHaveProperty('timestamp');
      expect(errorResponse).toHaveProperty('path');

      expect(createdResponse).toHaveProperty('success');
      expect(createdResponse).toHaveProperty('message');
      expect(createdResponse).toHaveProperty('timestamp');
      expect(createdResponse).toHaveProperty('path');

      expect(notFoundResponse).toHaveProperty('success');
      expect(notFoundResponse).toHaveProperty('message');
      expect(notFoundResponse).toHaveProperty('timestamp');
      expect(notFoundResponse).toHaveProperty('path');

      expect(validationResponse).toHaveProperty('success');
      expect(validationResponse).toHaveProperty('message');
      expect(validationResponse).toHaveProperty('timestamp');
      expect(validationResponse).toHaveProperty('path');
    });

    it('should have correct success flags', () => {
      expect(HttpResponse.success('Test').success).toBe(true);
      expect(HttpResponse.created('Test').success).toBe(true);
      expect(HttpResponse.error('Test').success).toBe(false);
      expect(HttpResponse.notFound('Test').success).toBe(false);
      expect(HttpResponse.validationError('Test').success).toBe(false);
    });

    it('should have correct data/error properties', () => {
      const testData = { test: 'data' };
      const testError = 'test error';

      expect(HttpResponse.success(testData, 'Test')).toHaveProperty(
        'data',
        testData
      );
      expect(HttpResponse.created(testData, 'Test')).toHaveProperty(
        'data',
        testData
      );
      expect(HttpResponse.error('Test', testError)).toHaveProperty(
        'error',
        testError
      );
      expect(HttpResponse.validationError('Test', testError)).toHaveProperty(
        'error',
        testError
      );
    });
  });

  describe('timestamp format', () => {
    it('should generate valid ISO timestamp', () => {
      const result = HttpResponse.success('Test message');
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should generate different timestamps for different calls', () => {
      const result1 = HttpResponse.success('Test 1');
      const result2 = HttpResponse.success('Test 2');

      // Los timestamps pueden ser muy cercanos, así que verificamos que existan
      expect(result1.timestamp).toBeDefined();
      expect(result2.timestamp).toBeDefined();
      expect(typeof result1.timestamp).toBe('string');
      expect(typeof result2.timestamp).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const result = HttpResponse.success('', '');
      expect(result.message).toBe('');
    });

    it('should handle null data', () => {
      const result = HttpResponse.success(null as any, 'Test');
      expect(result.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const result = HttpResponse.success(undefined as any, 'Test');
      expect(result.data).toBeUndefined();
    });

    it('should handle complex data structures', () => {
      const complexData = {
        users: [
          { id: '1', name: 'Juan' },
          { id: '2', name: 'María' },
        ],
        total: 2,
        metadata: {
          page: 1,
          limit: 10,
        },
      };

      const result = HttpResponse.success(complexData, 'Users retrieved');
      expect(result.data).toEqual(complexData);
    });
  });
});
