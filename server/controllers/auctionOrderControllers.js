import express from 'express';
import AuctionOrder from '../models/auctionOrderModel.js';

import User from '../models/userModel.js';
import Auction from '../models/auctionModel.js';
import { isAuth, isAdmin } from '../utils.js';

import expressAsyncHandler from 'express-async-handler';


// auctionorderRouter.get(
//   '/',
  export const getAllOrderAuction = (isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const auctionorders = await AuctionOrder.find().populate('user', 'name');
    res.send(auctionorders);
  })
);

// auctionorderRouter.post(
//   '/',
export const addressOrderAuction = (isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new AuctionOrder({
      orderItems: req.body.orderItems.map((auctionitem) => ({
        ...auctionitem,
        auction: auctionitem._id,
      })),

      auctionShippingAddress: req.body.auctionShippingAddress,
      auctionPaymentMethod: req.body.auctionPaymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const auctionorder = await newOrder.save();
    res.status(201).send({
      message: 'New AuctionOrder Created',
      auctionorder: auctionorder.toObject({ getters: true }),
    });
  })
);

// auctionorderRouter.get(
//   '/summary',
  export const summaryOrderAuction = ( isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const auctionorders = await AuctionOrder.aggregate([
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
    const dailyOrders = await AuctionOrder.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          auctionorders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const auctionCategories = await Auction.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, auctionorders, dailyOrders, auctionCategories });
  })
);

// auctionorderRouter.get(
//   '/mine',
  export const mineOrderAuction = ( isAuth,
  expressAsyncHandler(async (req, res) => {
    const auctionorders = await AuctionOrder.find({ user: req.user._id });
    res.send(auctionorders);
  })
);

// auctionorderRouter.get(
//   '/:id',
  export const getOrderAuction = (isAuth,
  expressAsyncHandler(async (req, res) => {
    const auctionorder = await AuctionOrder.findById(req.params.id);
    if (auctionorder) {
      res.send(auctionorder);
    } else {
      res.status(404).send({ message: 'AuctionOrder Not Found' });
    }
  })
);

// auctionorderRouter.delete(
//   '/:id',
  export const deleteOrderAuction = ( isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const auctionorder = await AuctionOrder.findById(req.params.id);
    if (auctionorder) {
      await AuctionOrder.findByIdAndDelete(req.params.id);
      res.send({ message: 'AuctionOrder Deleted' });
    } else {
      res.status(404).send({ message: 'AuctionOrder Not Found' });
    }
  })
);

// auctionorderRouter.put(
//   '/:id/pay',
  export const payOrderAuction = (isAuth,
  expressAsyncHandler(async (req, res) => {
    const auctionorder = await AuctionOrder.findById(req.params.id);
    if (auctionorder) {
      auctionorder.isPaid = true;
      auctionorder.paidAt = Date.now();
      auctionorder.auctionPaymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await auctionorder.save();
      res.send({ message: 'AuctionOrder Paid Successfully', auctionorder: updatedOrder });
    } else {
      res.status(404).send({ message: 'AuctionOrder Not Found' });
    }
  })
);

// auctionorderRouter.put(
//   '/:id/deliver',
  export const deliverOrderAuction = (isAuth,
  expressAsyncHandler(async (req, res) => {
    const auctionorder = await AuctionOrder.findById(req.params.id);
    if (auctionorder) {
      auctionorder.isDelivered = true;
      auctionorder.deliveredAt = Date.now();
      await auctionorder.save();
      res.send({ message: 'AuctionOrder Delivered' });
    } else {
      res.status(404).send({ message: 'AuctionOrder Not Found' });
    }
  })
);

