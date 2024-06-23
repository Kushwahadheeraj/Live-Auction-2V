import React, { useContext, useEffect, useReducer } from 'react';
import { Avatar, Dropdown } from "flowbite-react";
import Loading from '../../Components/Loading/Loading';
import LoadingDots from '../../Components/LoadingDots/LoadingDots';
import ErrorPage from '../../Components/ErrorPage/ErrorPage';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      return state;
  }
};

export default function AuctionOrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const totalPriceUSD = order.totalPrice;

  const createOrder = (data, action) => {
    return action.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPriceUSD.toFixed(2) },
          },
        ],
      })
      .then((orderID) => {
        return orderID; // orderID is coming from PayPal
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/v2/auctionorders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log(data)
        // after payment is successful
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order Paid Succefully🎉');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  };
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/v2/auctionorders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate('/signin');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/v2/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/v2/auctionorders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order Delivered Successfully 🎉');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorPage />
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>

      <div className="px-4 py-14 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        <div className="flex flex-col justify-start space-y-2 auction-start">
          <h1 className="text-3xl font-semibold leading-7 text-gray-800 light:text-white lg:text-4xl lg:leading-9">
            Order #{orderId}
          </h1>
          <p className="text-base font-medium leading-6 text-gray-600 light:text-gray-300">
            {new Intl.DateTimeFormat('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZoneName: 'short',
            }).format(new Date(order.createdAt))}
          </p>
        </div>
        <div className="flex flex-col items-stretch w-full mt-10 space-y-4 xl:flex-row jusitfy-center xl:space-x-8 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col items-start justify-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col items-start justify-start w-full px-4 py-4 light:bg-gray-800 bg-gray-50 md:py-6 md:p-6 xl:p-8">
              <p className="text-lg font-semibold leading-6 text-gray-800 md:text-xl light:text-white xl:leading-5">
                Customer’s Cart
              </p>
              {order.orderItems.map((auction) => (
                <div
                  className="flex flex-col items-start justify-start w-full mt-4 md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8"
                  key={auction._id}
                >
                  <div className="w-20 pb-4 md:pb-8">
                    <img
                      className="hidden w-full md:block"
                      src={auction.imageUrl}
                      alt={auction.title}
                    />
                    <img
                      className="w-full md:hidden"
                      src={auction.imageUrl}
                      alt={auction.title}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between w-full pb-8 space-y-4 border-b border-gray-200 md:flex-row md:space-y-0">
                    <div className="flex flex-col items-start justify-start w-full space-y-8">
                      <h3 className="text-xl font-semibold leading-6 text-gray-800 light:text-white">
                        <Link to={`/auction/${auction.title}`}>{auction.title}</Link>
                      </h3>
                    </div>
                    <div className="flex items-start justify-between w-full space-x-8">
                      <p className="text-base leading-6 light:text-white xl:text-lg">
                        <small>₹</small>
                        {auction.currentBid}
                      </p>
                      {/* <p className="text-base leading-6 text-gray-800 light:text-white xl:text-lg">
                        {auction.quantity}
                      </p>
                      <p className="text-base font-semibold leading-6 text-gray-800 light:text-white xl:text-lg">
                        <small>₹</small>
                        {auction.quantity * auction.price}
                      </p> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col w-full px-4 py-6 space-y-6 md:p-6 xl:p-8 bg-gray-50 light:bg-gray-800">
                <h3 className="text-xl font-semibold leading-5 text-gray-800 light:text-white">
                  Summary
                </h3>
                <div className="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200">
                  <div className="flex justify-between w-full">
                    <p className="text-base leading-4 text-gray-800 light:text-white">
                      Items
                    </p>
                    <p className="text-base leading-4 text-gray-600 light:text-gray-300">
                      <small>₹</small>
                      {order.itemsPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base leading-4 text-gray-800 light:text-white">
                      Tax
                    </p>
                    <p className="text-base leading-4 text-gray-600 light:text-gray-300">
                      <small>₹</small>
                      {order.taxPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base leading-4 text-gray-800 light:text-white">
                      Shipping
                    </p>
                    <p className="text-base leading-4 text-gray-600 light:text-gray-300">
                      <small>₹</small>
                      {order.shippingPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs leading-4 text-center text-gray-300 light:text-white">
                    Paypal does not accept payments in USD
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-base font-semibold leading-4 text-gray-800 light:text-white">
                    Total in Amount
                  </p>
                  <p className="text-base font-semibold leading-4 text-gray-600 light:text-gray-300">
                    <small>₹</small>
                    {totalPriceUSD.toFixed(2)}
                  </p>
                </div>
                {!order.isPaid && (
                  <div className="w-full ">
                    {isPending ? (
                      <LoadingDots />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                    {loadingPay && <LoadingDots />}
                  </div>
                )}

                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <div className="w-full">
                    {loadingDeliver && <LoadingDots />}
                    <div className="flex justify-center">
                      <button
                        className="w-full px-4 py-2 font-medium text-white transition-colors duration-200 bg-yellow-500 rounded hover:bg-yellow-600"
                        type="button"
                        onClick={deliverOrderHandler}
                      >
                        Deliver Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center w-full px-4 py-6 space-y-6 md:p-6 xl:p-8 bg-gray-50 light:bg-gray-800">
                <h3 className="text-xl font-semibold leading-5 text-gray-800 light:text-white">
                  Shipping
                </h3>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-8 h-8">
                      <img
                        className="w-full h-full"
                        alt="logo"
                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-start">
                      <p className="text-lg font-semibold leading-6 text-gray-800 light:text-white">
                        Payment Method
                        <br />
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-6 text-gray-800 light:text-white">
                    {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <div
                    className={`light:bg-white light:text-gray-800 light:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full text-center font-medium leading-4 text-white 
                    ${
                      order.isPaid
                        ? 'bg-green-500 hover:bg-green-600 duration-500'
                        : 'bg-red-500 hover:bg-red-600 duration-500'
                    }
                    `}
                  >
                    {order.isPaid
                      ? `Paid at: ${new Intl.DateTimeFormat('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          timeZoneName: 'short',
                        }).format(new Date(order.paidAt))}`
                      : 'NOT PAID'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between w-full px-4 py-6 bg-gray-50 light:bg-gray-800 xl:w-96 md:items-start md:p-6 xl:p-8">
            <h3 className="text-xl font-semibold leading-5 text-gray-800 light:text-white">
              Customer
            </h3>
            <div className="flex flex-col items-stretch justify-start w-full h-full md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col items-start justify-start flex-shrink-0">
                <div className="flex items-center justify-center w-full py-8 space-x-4 border-b border-gray-200 md:justify-start">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                      <Avatar
                        alt="user"
                        img={userInfo.profilePicture}
                        rounded
                      />
                    }
                  ></Dropdown>
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-base font-semibold leading-4 text-left text-gray-800 light:text-white">
                      {userInfo.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full py-4 space-x-4 text-gray-800 border-b border-gray-200 light:text-white md:justify-start">
                  <i className="text-xl far fa-envelope light:hidden"></i>
                  <i className="hidden text-xl far fa-envelope light:block"></i>
                  <p className="text-sm leading-5 cursor-pointer ">
                    {userInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-stretch justify-between w-full mt-6 xl:h-full md:mt-0">
                <div className="flex flex-col items-center justify-center space-y-4 md:justify-start xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 xl:space-y-12 md:space-y-0 md:flex-row md:items-start">
                  <div className="flex flex-col items-center justify-center space-y-4 md:justify-start md:items-start xl:mt-8">
                    <p className="text-base font-semibold leading-4 text-center text-gray-800 light:text-white md:text-left">
                      Shipping Address
                    </p>
                    <p className="w-48 text-sm leading-5 text-center text-gray-600 lg:w-full light:text-gray-300 xl:w-48 md:text-left">
                      {order.auctionShippingAddress.fullName}, <br />
                      {order.auctionShippingAddress.address},
                      {order.auctionShippingAddress.city}, <br />
                      {order.auctionShippingAddress.pinCode},
                      {order.auctionShippingAddress.country}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-4 md:justify-start md:items-start">
                    <p className="text-base font-semibold leading-4 text-center text-gray-800 light:text-white md:text-left">
                      Billing Address
                    </p>
                    <p className="w-48 text-sm leading-5 text-center text-gray-600 lg:w-full light:text-gray-300 xl:w-48 md:text-left">
                      {order.auctionShippingAddress.fullName}, <br />
                      {order.auctionShippingAddress.address},{' '}
                      {order.auctionShippingAddress.city}, <br />
                      {order.auctionShippingAddress.pinCode},{' '}
                      {order.auctionShippingAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-full md:justify-start md:items-start">
                  <div
                    className={`mt-6 md:mt-0 light:border-white light:hover:bg-gray-900 light:bg-transparent light:text-white py-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border font-medium w-96 2xl:w-full text-center leading-4 text-white ${
                      order.isDelivered
                        ? 'bg-green-500 hover:bg-green-600 duration-500'
                        : 'bg-red-500 hover:bg-red-600 duration-500'
                    }`}
                  >
                    {order.isDelivered
                      ? `Delivered at: ${new Intl.DateTimeFormat('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          timeZoneName: 'short',
                        }).format(new Date(order.deliveredAt))}`
                      : 'NOT DELIVERED'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
