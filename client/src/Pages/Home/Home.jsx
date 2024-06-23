import React, { useEffect, useReducer,useState,useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Loading from '../../Components/Loading/Loading';
import ErrorPage from '../../Components/ErrorPage/ErrorPage';
import BannerProduct from '../../Components/BannerProduct';
import CallToAction from '../../Components/CallToAction';
import AuctionItem from '../../Components/AuctionItem/AuctionItem';
import { Store } from '../../Store';
import { toast } from 'react-toastify';

// const initialState = {
//   products: [],
//   loading: true,
//   error: '',
// };

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


function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  
  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get('/api/v2/auctions'); // replace with your API endpoint
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (err) {
        console.log(err);
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  const [auctions, setAuctions] = useState([]);

  const handleDeleteAuction = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        // eslint-disable-next-line
        const { data } = await axios.delete(`/api/v2/auctions/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setAuctions(auctions.filter((auction) => auction.id !== id));
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: products.filter((product) => product._id !== id),
        });
        toast.success('Auction Deleted!');
      } catch (error) {
        toast.error(error);
      }
    }
  };



  return (
    <div className="home__component">
      <div className="pt-8 pb-4 text-center">
        
        <Helmet>
          <title>Live Auction</title>
        </Helmet>
        <BannerProduct/>
        <h2 className="flex mt-6 justify-center w-4/12 px-2 mx-auto text-4xl text-center text-gray-600 align-middle border-b-2 border-solid md:inline-block border-lightgray">
          Listed Products
        </h2>
      </div>

      <div className="text-center">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorPage />
        ) : (
          <>
            {/* <Categories /> */}
            
            <main className="container mx-auto py-8">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorPage />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.reverse().map((product) => (
              <div className="border-b border-gray-200 py-2" key={product._id}>
                {(product.bids.length > 0 &&
                  product.bids[product.bids.length - 1]?.bidder) ===
                userInfo?.name ? (
                  <AuctionItem
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    imageUrl={product.imageUrl}
                    endDate={product.endDate}
                    currentBid={product.currentBid}
                    highestBidder={userInfo.name}
                    handleDeleteAuction={() => handleDeleteAuction(product._id)}
                  />
                ) : (
                  <AuctionItem
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    imageUrl={product.imageUrl}
                    endDate={product.endDate}
                    currentBid={product.currentBid}
                    highestBidder="NoBids"
                    handleDeleteAuction={() => handleDeleteAuction(product._id)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-2">No auctions found!</h2>
            <p className="text-gray-500">
              Please check back later for more auctions.
            </p>
          </div>
        )}
      </main>
          </>
        )}
         <div className='p-3 bg-lime-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>
      </div>
    </div>
  );
}

export default Home;
