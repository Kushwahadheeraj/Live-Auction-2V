import { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../../Components/CheckoutSteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import './PaymentMethod.css';
import { Store } from '../../Store';
import { useNavigate } from 'react-router';

function PaymentCard({ id, value, logo, label, selected, onClick }) {
  return (
    <div
      className={`border-2 border-gray-300 rounded-lg p-8 cursor-pointer transition-colors duration-300 flex items-center justify-center flex-col lg:w-96 lg:h-64 ${
        selected ? 'border-cyan-500 shadow-md' : 'bg-gray-100 hover:bg-white'
      }`}
      onClick={() => onClick(id)}
    >
      <input
        type="radio"
        name="payment-method"
        id={id}
        value={value}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center h-full cursor-pointer"
      >
        <img
          className={`w-full h-auto filter grayscale ${
            selected ? 'filter-none duration-500' : ''
          }`}
          src={logo}
          alt={label}
        />
        <span className="mt-4 text-lg font-bold">{label}</span>
      </label>
    </div>
  );
}

export default function AuctionPaymentMethod() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    auctionitem: { auctionShippingAddress, auctionPaymentMethod },
  } = state;

  const navigate = useNavigate();

  useEffect(() => {
    if (!auctionShippingAddress.address) {
      navigate('/auctionshipping');
    }
  }, [auctionShippingAddress, navigate]);

  const [paymentMethodName, setPaymentMethod] = useState(
    auctionPaymentMethod || 'PayPal'
  );
  const [paymentMethodNameS, setPaymentMethodS] = useState(
    auctionPaymentMethod || 'Stripe'
  );

  // selected card
  const handleCardClick = (id) => {
    setPaymentMethod(id);
    setPaymentMethodS(id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('auctionPaymentMethod', paymentMethodName);
    navigate('/auctionplaceorder');
  };

  return (
    <div className="area">
      <ul className="circles">
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
      <Helmet>
        <title>Payment-Auction</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <div className="flex flex-col items-center justify-center max-w-3xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Select Payment Method</h1>
        <div className="flex items-center justify-center space-x-16">
          <PaymentCard
            id="PayPal"
            value="PayPal"
            logo="https://www.freepnglogos.com/uploads/paypal-logo-png-1.png"
            label="PayPal"
            selected={paymentMethodName === 'PayPal'}
            onClick={handleCardClick}
          />
          <PaymentCard
            id="Stripe"
            value="Stripe"
            logo="https://stripe.com/img/v3/home/social.png"
            label="Stripe"
            selected={paymentMethodNameS === 'Stripe'}
            onClick={handleCardClick}
          />
        </div>
        <button
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold mt-16 w-[50%] py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={submitHandler}
        >
          Continue
        </button>
      </div>
    </div>
  );
}