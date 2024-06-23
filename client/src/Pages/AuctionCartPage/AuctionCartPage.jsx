import axios from 'axios';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import './CartPage.css';

export default function AuctionCartPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    auctionitem: { auctioncartItems },
  } = state;

  const updateCartHandler = async (items, quantity) => {
    const { data } = await axios.get(`/api/v2/auctions/${items._id}`);
    if (data.stock < quantity) {
      window.alert('Product is out of stock.');
      return;
    }
    ctxDispatch({
      type: 'AUCTIONCART_ADD_ITEM',
      payload: { ...items, quantity },
    });
  };

  const removeItemHandler = (auction) => {
    ctxDispatch({ type: 'AUCTIONCART_REMOVE_ITEM', payload: auction });
  };

  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/signin?redirect=/auctionshipping');
  };

  return (
    <div>
      <Helmet>
        <title>Live Auction</title>
      </Helmet>
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            {auctioncartItems.length === 0 ? (
              <div className="p-4 text-gray-700 bg-gray-100 border rounded-md">
                Cart is empty.{' '}
                <Link to="/" className="font-bold text-cyan-600">
                  Go Shopping
                </Link>
              </div>
            ) : (
              <div className="duration-500 bg-white border-b border-gray-200 shadow sm:rounded-lg hover:transform hover:scale-105 backface-hidden">
                <div className="max-w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50">
                      <tr className="hidden md:table-row">
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Product
                        </th>
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Quantity
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auctioncartItems.map((auction) => (
                        <tr key={auction._id}>
                          <td className="px-6 py-4 whitespace-nowrap md:px-2 md:py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10">
                                <img
                                  className="w-10 h-10 rounded-full"
                                  src={auction.imageUrl}
                                  alt={auction.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 whitespace-normal">
                                  <Link to={`/products/${auction.title}`}>
                                    {auction.title}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap md:px-2 md:py-3">
                            <div className="flex items-center">
                               <button
                                className={`mr-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 ${
                                  auction.quantity === 1
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                                }`}
                                disabled={auction.quantity === 1}
                                onClick={() =>
                                  updateCartHandler(auction, auction.quantity - 1)
                                }
                              >
                                -
                              </button>
                              <span className="pr-2 text-sm font-medium text-gray-900">
                                {auction.quantity}
                              </span>
                              <button
                                className={`mr-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 ${
                                  auction.quantity >= auction.stock
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                                }`}
                                disabled={auction.quantity >= auction.stock}
                                onClick={() =>
                                  updateCartHandler(auction, auction.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            ₹{auction.price.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            ₹
                            {auction.currentBid.toLocaleString(
                              'en-IN'
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeItemHandler(auction)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="mx-2 duration-500 md:col-span-4 hover:transform hover:scale-105">
            <div className="bg-white shadow-lg sm:rounded-lg md:-mt-3">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Items:</span>
                  <span className="font-medium text-gray-900">
                    {auctioncartItems.reduce((acc, auction) => acc + auction.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium text-gray-900">
                    ₹
                    {auctioncartItems
                      .reduce(
                        (acc, auction) => acc + auction.currentBid,
                        0
                      )
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  className={`w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded ${
                    auctioncartItems.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={auctioncartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
