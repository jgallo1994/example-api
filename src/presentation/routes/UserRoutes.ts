import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import {
  validateRequest,
  userValidationSchemas,
} from '../middlewares/joiValidationMiddleware';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post(
    '/',
    validateRequest(userValidationSchemas.createUser),
    (req: Request, res: Response) => userController.createUser(req, res)
  );
  router.get('/', (req: Request, res: Response) =>
    userController.getAllUsers(req, res)
  );
  router.get(
    '/:id',
    validateRequest(userValidationSchemas.getUser),
    (req: Request, res: Response) => userController.getUser(req, res)
  );
  router.put(
    '/:id',
    validateRequest(userValidationSchemas.updateUser),
    (req: Request, res: Response) => userController.updateUser(req, res)
  );
  router.delete(
    '/:id',
    validateRequest(userValidationSchemas.deleteUser),
    (req: Request, res: Response) => userController.deleteUser(req, res)
  );

  return router;
}
