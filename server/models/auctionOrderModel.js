import mongoose from 'mongoose';

const auctionorderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        
        title: { type: String, required: true },
       currentBid: { type: Number, required: true },
       imageUrl: { type: String, required: true },
       auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true,
      },
      },
    ],
    auctionShippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    auctionPaymentMethod: { type: String, required: true },
    auctionPaymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true, 
  }
);

const AuctionOrder = mongoose.model('AuctionOrder', auctionorderSchema);

export default AuctionOrder;
