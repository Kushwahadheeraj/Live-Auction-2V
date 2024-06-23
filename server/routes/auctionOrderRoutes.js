import express from 'express';

import { getAllOrderAuction,getOrderAuction,
    summaryOrderAuction,addressOrderAuction,
    mineOrderAuction,deleteOrderAuction,
    deliverOrderAuction,payOrderAuction } from '../controllers/auctionOrderControllers.js';

const router = express.Router();

router.get('/',getAllOrderAuction);
router.get('/:id',getOrderAuction);
router.post('/',addressOrderAuction);
router.get('/summary',summaryOrderAuction);
router.get('/mine',mineOrderAuction);
router.delete('/:id',deleteOrderAuction);
router.put('/:id/pay',payOrderAuction);
router.put( '/:id/deliver',deliverOrderAuction);

export default router;