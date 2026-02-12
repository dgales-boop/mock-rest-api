import { Router } from 'express';
import * as sitesController from '../../controllers/sitesController';

const router = Router();

router.get('/', sitesController.listSites);
router.get('/level2/:level2Id/protocols/:protocolId', sitesController.getProtocolById);
router.get('/level2/:level2Id/protocols', sitesController.getProtocolsByLevel2Id);
router.get('/level2/:id', sitesController.getLevel2ById);
router.get('/:siteId/:level2Id/:protocolId', sitesController.getProtocolBySiteLevel2AndProtocol);
router.get('/:siteId/:level2Id', sitesController.getLevel2BySiteAndLevel2);
router.get('/:id', sitesController.getSiteById);

export default router;
