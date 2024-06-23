import express from 'express';

import { createAuction,getAllAuction,getAuction,deleteAuction,bidAuction } from '../controllers/auctionControllers.js';

const router = express.Router();

router.post('/',createAuction);
router.get('/',getAllAuction);
router.get('/:id',getAuction);
router.post('/:id/bids',bidAuction);
router.delete('/:id',deleteAuction);


export default router;