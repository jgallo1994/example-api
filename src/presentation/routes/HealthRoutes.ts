import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { AdvancedHealthController } from '../controllers/AdvancedHealthController';

export function createHealthRoutes(
  healthController: HealthController,
  advancedHealthController: AdvancedHealthController
): Router {
  const router = Router();

  router.get('/health', (req, res) => healthController.getHealth(req, res));
  router.get('/health/advanced', (req, res) =>
    advancedHealthController.getAdvancedHealth(req, res)
  );

  return router;
}
