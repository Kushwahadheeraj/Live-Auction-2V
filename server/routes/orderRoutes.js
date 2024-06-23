import express from 'express';
import Order from '../models/orderModel.js';

import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

import expressAsyncHandler from 'express-async-handler';

import { getAllOrder,getOrder,deleteOrder,deliverOrder,
       payOrder,mineOrder,
    //    summaryOrder,
       addressOrder
 } from '../controllers/orderControllers.js';

 const router = express.Router();

 router.get('/',getAllOrder);
 router.get('/:id',getOrder);
 router.post('/',addressOrder);
//  router.get('/summary',summaryOrder);
 router.get('/mine',mineOrder);
 router.delete('/:id',deleteOrder);
 router.put('/:id/pay',payOrder);
 router.put( '/:id/deliver',deliverOrder);



 
router.get(
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]);
      const users = await User.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const productCategories = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
      res.send({ users, orders, dailyOrders, productCategories });
    })
  );
  

 
export default router;