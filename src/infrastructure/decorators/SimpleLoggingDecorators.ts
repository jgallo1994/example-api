import { logger } from '../logging/Logger';

export function LogUseCase() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any) {
    const methods = Object.getOwnPropertyNames(target.prototype).filter(
      name => name !== 'constructor'
    );

    methods.forEach(methodName => {
      const originalMethod = target.prototype[methodName];

      if (typeof originalMethod === 'function') {
        target.prototype[methodName] = async function (...args: unknown[]) {
          const useCaseName = this.constructor.name;
          const startTime = Date.now();

          logger.info(`Starting ${useCaseName}.${methodName}`, {
            useCase: useCaseName,
            method: methodName,
            timestamp: new Date().toISOString(),
          });

          try {
            const result = await originalMethod.apply(this, args);
            const duration = Date.now() - startTime;

            logger.info(`Successfully completed ${useCaseName}.${methodName}`, {
              useCase: useCaseName,
              method: methodName,
              duration: `${duration}ms`,
              success: true,
            });

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            logger.error(`Failed to execute ${useCaseName}.${methodName}`, {
              useCase: useCaseName,
              method: methodName,
              duration: `${duration}ms`,
              success: false,
              error: errorMessage,
            });

            throw error;
          }
        };
      }
    });
  };
}

export function LogRepository() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any) {
    const methods = Object.getOwnPropertyNames(target.prototype).filter(
      name => name !== 'constructor'
    );

    methods.forEach(methodName => {
      const originalMethod = target.prototype[methodName];

      if (typeof originalMethod === 'function') {
        target.prototype[methodName] = async function (...args: unknown[]) {
          const repositoryName = this.constructor.name;
          const startTime = Date.now();

          logger.debug(
            `Starting repository operation: ${repositoryName}.${methodName}`,
            {
              repository: repositoryName,
              method: methodName,
              timestamp: new Date().toISOString(),
            }
          );

          try {
            const result = await originalMethod.apply(this, args);
            const duration = Date.now() - startTime;

            logger.debug(
              `Successfully completed repository operation: ${repositoryName}.${methodName}`,
              {
                repository: repositoryName,
                method: methodName,
                duration: `${duration}ms`,
                success: true,
              }
            );

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            logger.error(
              `Repository operation failed: ${repositoryName}.${methodName}`,
              {
                repository: repositoryName,
                method: methodName,
                duration: `${duration}ms`,
                success: false,
                error: errorMessage,
              }
            );

            throw error;
          }
        };
      }
    });
  };
}

export function LogController() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any) {
    const methods = Object.getOwnPropertyNames(target.prototype).filter(
      name => name !== 'constructor'
    );

    methods.forEach(methodName => {
      const originalMethod = target.prototype[methodName];

      if (typeof originalMethod === 'function') {
        target.prototype[methodName] = async function (...args: unknown[]) {
          const controllerName = this.constructor.name;
          const startTime = Date.now();

          logger.info(
            `Starting controller operation: ${controllerName}.${methodName}`,
            {
              controller: controllerName,
              method: methodName,
              timestamp: new Date().toISOString(),
            }
          );

          try {
            const result = await originalMethod.apply(this, args);
            const duration = Date.now() - startTime;

            logger.info(
              `Successfully completed controller operation: ${controllerName}.${methodName}`,
              {
                controller: controllerName,
                method: methodName,
                duration: `${duration}ms`,
                success: true,
              }
            );

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            logger.error(
              `Controller operation failed: ${controllerName}.${methodName}`,
              {
                controller: controllerName,
                method: methodName,
                duration: `${duration}ms`,
                success: false,
                error: errorMessage,
              }
            );

            throw error;
          }
        };
      }
    });
  };
}
