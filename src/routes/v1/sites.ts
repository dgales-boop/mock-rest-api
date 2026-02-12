import { Router } from 'express';
import * as sitesController from '../../controllers/sitesController';

const router = Router();

router.get('/', sitesController.listSites);
router.get('/level2/:id', sitesController.getLevel2ById);
router.get('/:id', sitesController.getSiteById);

export default router;
