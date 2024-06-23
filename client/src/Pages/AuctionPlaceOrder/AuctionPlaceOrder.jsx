import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../Components/CheckoutSteps/CheckoutSteps';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import { Store } from '../../Store';
import './PlaceOrder.css';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import io from 'socket.io-client';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function AuctionPlaceOrder() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { auctionitem, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  auctionitem.itemsPrice = round2(
    auctionitem.auctioncartItems.reduce((acc, auction) => acc + auction.currentBid, 0)
  );
  // console.log(currentBid);


  auctionitem.shippingPrice = auctionitem.itemsPrice > 500 ? round2(0) : round2(50);

  auctionitem.taxPrice = round2(0.18 * auctionitem.itemsPrice);
  auctionitem.totalPrice = auctionitem.itemsPrice + auctionitem.shippingPrice + auctionitem.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/v2/auctionorders',
        {
          orderItems: auctionitem.auctioncartItems,
          auctionShippingAddress: auctionitem.auctionShippingAddress,
          auctionPaymentMethod: auctionitem.auctionPaymentMethod,
          itemsPrice: auctionitem.itemsPrice,
          shippingPrice: auctionitem.shippingPrice,
          taxPrice: auctionitem.taxPrice,
          totalPrice: auctionitem.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('auctioncartItems');
      navigate(`/auctionorder/${data.auctionorder._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!auctionitem.auctionPaymentMethod) {
      navigate('/auctionpayment');
    }
  }, [auctionitem, navigate]);
  return (
    <div className="areas">
      <ul className="circless">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <div className="container flex flex-col px-4 py-8 mx-auto lg:flex-row">
        {/* Preview Order */}
        <div className="flex flex-col w-full">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">
            Preview Order
          </h1>

          <div className="flex-none w-full lg:w-auto">
            {/* Shipping Card */}
            <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Shipping
              </h2>
              <p className="mb-2 text-gray-700">
                <strong>Name: </strong>
                {auctionitem.auctionShippingAddress.fullName}{' '}
              </p>
              <p className="mb-4 text-gray-700">
                <strong>Address: </strong>
                 {auctionitem.auctionShippingAddress.address},
                {auctionitem.auctionShippingAddress.city}, {auctionitem.auctionShippingAddress.pinCode},{' '}
                {auctionitem.auctionShippingAddress.country}
              </p>
              <Link
                to="/shipping"
                className="text-cyan-500 hover:text-cyan-600"
              >
                Edit
              </Link>
            </div>

            {/* Payment Card */}
            <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Payment
              </h2>
              <p className="mb-2 text-gray-700">
                <strong>Method: </strong>
                {auctionitem.auctionPaymentMethod}
              </p>
              <a href="/payment" className="text-cyan-500 hover:text-cyan-600">
                Edit
              </a>
            </div>

            {/* Order Summary Card */}
            <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-700">Items</p>
                  <p className="text-gray-700">
                    {auctionitem.itemsPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">
                    {auctionitem.shippingPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-gray-700">Tax</p>
                  <p className="text-gray-700">
                    {auctionitem.taxPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Order Total</p>
                  <p className="text-lg font-semibold">
                    <small>₹</small>
                    {auctionitem.totalPrice.toFixed(2).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  className="px-4 py-2 mt-4 text-white duration-200 rounded bg-cyan-500 hover:bg-cyan-600"
                  onClick={placeOrderHandler}
                  // disabled={auctionitem.auctioncartItems.length === 0}
                >
                  Checkout
                </button>
                {loading && <Loading />}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow mr-2 overflow-x-auto lg:w-full lg:ml-8 lg:mt-8">
          <h1 className="text-2xl font-semibold text-gray-800 lg:mt-[-30px] lg:mb-4">
            Products
          </h1>
          {auctionitem.auctioncartItems.map((auction) => (
            // Items Card
            <div
              className="p-4 mb-2 duration-500 bg-white rounded-lg shadow-md hover:px-8 md:mb-2"
              key={auction._id}
            >
              <div className="flex items-center mb-0 space-x-4">
                <img
                  src={auction.image}
                  alt={auction.name}
                  className="w-16 h-16 bg-gray-200 rounded-full"
                ></img>
                <div className="flex-grow pt-4 text-center">
                  <Link
                    to={`/products/${auction.url}`}
                    className="font-semibold text-gray-700"
                  >
                    {auction.name}
                  </Link>
                </div>
                <p className="ml-auto text-gray-700">
                  Total: <small>₹</small>
                  {auction.currentBid.toLocaleString('en-IN')}
                </p>
              </div>
              <Link
                to={`/products/${auction.url}`}
                className="text-cyan-500 hover:text-cyan-600"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    //   </div>
    // </div> 
  );
}
