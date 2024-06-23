import { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import io from 'socket.io-client';
import ErrorPage from '../../Components/ErrorPage/ErrorPage';
import Loading from '../../Components/Loading/Loading';
import { Store } from '../../Store';

const initialState = {
  products: [],
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const AuctionDetail = (props) => {
  const [{ loading, error }, dispatch] = useReducer(reducer, initialState);
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  
  const [bid, setBid] = useState('');
  const [socket, setSocket] = useState(null);

  const {
    state: { userInfo },
  } = useContext(Store);

// ####################################

// const { state, dispatch: ctxDispatch } = useContext(Store);
//   const {
//     auctionitem: { auctioncartItems },
//   } = state;
  // const addToCartHandler = async (items) => {
  //   const existItem = auctioncartItems.find((items) => items._id === auction._id);

  //   const quantity = existItem ? existItem.quantity + 1 : 1;

  //   const { data } = await axios.get(`/api/v2/auctions/${items._id}`);
  //   if (data.stock < quantity) {
  //     toast.error('Product is out of stock.');
  //     return;
  //   }
  //   ctxDispatch({
  //     type: 'AUCTIONCART_ADD_ITEM',
  //     payload: { ...items, quantity },
  //   });
  // };

  // const { auction } = props;
  // ###################################




  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(`/api/v2/auctions/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = response.data;
        console.log(data)
        setAuction(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();

    const newSocket = io(process.env.REACT_APP_API_PROXY);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, 
  [id, userInfo.token]
);

  useEffect(() => {
    if (socket) {
      socket.on('bid', (updatedAuction) => {
        setAuction(updatedAuction);
      });
    }
  }, [socket]);

  const handleSubmit = async (event, userName) => {
    event.preventDefault();
    const response = await axios.post(
      `/api/v2/auctions/${id}/bids`,
      {
        bidder: userName,
        bidAmount: bid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    const data = response.data;
    setAuction(data);
    setBid('');
    socket.emit('bid', data);
    toast.success('Bid Placed Successfully 🎉');
  };

  const handleBidChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBid(value);
    }
  };

  const navigate = useNavigate();
  const checkoutHandler = () => {
    navigate('/signin?redirect=/auctionshipping');
  };
  // const addToCartHandler = () => {
  //   navigate('/signin?redirect=/auctioncart');
  // };
  

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorPage />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Image of product */}
          <div className="w-full p-4">
            <img
              src={auction.imageUrl}
              alt={auction.title}
              className="object-contain w-full max-w-2xl rounded-lg shadow-lg "
            />
          </div>

          {/* Product details */}
          <div className="w-full p-4 mt-3 bg-white rounded-lg shadow-lg">
            <h2 className="mb-2 text-2xl font-bold">{auction.title}</h2>
            <p className="mb-4 text-base text-gray-500">
              {auction.description}
            </p>

            {/* Time left for auction */}
            <TimeLeft endDate={auction.endDate} />

            {/* Current bid */}
            <div className="flex items-center justify-between py-2 mb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500">Starting Bid:</p>
              <p className="text-lg font-semibold">
                ₹{auction.startingBid.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500">Current Bid:</p>
              <p className="text-lg font-semibold">
                ₹{auction.currentBid.toLocaleString('en-IN')}
              </p>
            </div>
             {auction.bids.length > 0 && (
              <div className="py-2 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">Highest Bidder</p>
                  <p className="text-lg font-semibold">
                    {auction.bids[auction.bids.length - 1]?.bidder}
                  </p>
                </div>
              </div>
            )} 

            {/* New bid input field and submit button */}
              {new Date(auction.endDate).getTime() <= Date.now() ? (
              <>
                {auction.bids.length > 0 && (
                  <div className="py-2 border-b border-gray-200">
                    <p className="text-lg font-semibold">
                      {(auction.bids[auction.bids.length - 1]?.bidder) ===
                      userInfo.name ? (
                        <button className="w-full px-4 py-2 mt-4 text-white duration-200 bg-green-500 rounded-md hover:bg-green-600"
                        onClick={checkoutHandler}
                        // onClick={() => addToCartHandler(auction)}
                        >
                          PAY
                        </button>
                        ) : (  
                        <button
                          className="w-full px-4 py-2 mt-4 text-gray-400 duration-200 bg-gray-100 rounded-md cursor-not-allowed"
                          disabled
                        >
                          Auction Ended
                        </button>
                        )}  
                    </p>
                  </div>
                  )}  
              </>
             ) : (auction.bids[auction.bids.length - 1]?.bidder) ===
              userInfo.name ? ( 
              <button className="inline-block w-full px-6 py-2 font-semibold leading-5 text-white bg-green-500 rounded-lg cursor-default hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                You have the highest bid 🎉
              </button>
             ) : userInfo ?( 
             <form
                onSubmit={(e) => handleSubmit(e, userInfo.name)}
                className="flex items-center"
              >
                <div className="relative flex-grow mr-4">
                  <input
                    type="number"
                    className="block w-full px-3 py-2 pr-10 leading-5 border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your bid"
                    value={bid}
                    onChange={handleBidChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-lg">₹</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-block px-6 py-2 font-semibold leading-5 text-white rounded-lg bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Bid
                </button>
              </form>
             ) : ( 
              <Link to="/signin">
                <button className="inline-block px-6 py-2 font-semibold leading-5 text-white rounded-lg bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Login to bid
                </button>
              </Link>
             )}  
            {auction.bids.length > 0 && (
              <div className="py-2 mt-4 border-b border-gray-200">
                <h3 className="mb-2 text-lg font-bold">Bids History:</h3>
                {auction.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <p className="text-sm text-gray-500">{bid.bidder}</p>
                    <p className="text-sm text-gray-500">
                      ₹{bid.bidAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                 ))} 
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 

function TimeLeft({ endDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = (new Date(endDate) - new Date()) / 1000;
      if (duration <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(duration / (24 * 3600));
        const hours = Math.floor((duration % (24 * 3600)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endDate]);

  return (
    <div className="items-center py-2 mb-4 border-t border-b border-gray-200">
      <p className="text-sm text-gray-500">Time Left:</p>
      <div className="w-full p-4 mt-3 bg-white rounded-lg shadow-xl">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{timeLeft.days}</div>
            <div className="text-sm text-gray-500">days</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{timeLeft.hours}</div>
            <div className="text-sm text-gray-500">hours</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-500">minutes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-500">seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetail;
