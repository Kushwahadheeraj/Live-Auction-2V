import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Product from '../../Components/Product/Product';
import { Helmet } from 'react-helmet-async';
import Loading from '../../Components/Loading/Loading';
import ErrorPage from '../../Components/ErrorPage/ErrorPage';
import Categories from '../../Components/Categories/Categories';
import BannerProduct from '../../Components/BannerProduct';
import CallToAction from '../../Components/CallToAction';

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


function Shoping() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/v2/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []); 

  return (
    <div className="home__component">
      <div className="pt-8 pb-4 text-center">
        <BannerProduct/>
        <Helmet>
          <title>Shopping</title>
        </Helmet>
        <h2 className="flex justify-center w-4/12 px-2 mx-auto text-4xl text-center text-gray-600 align-middle border-b-2 border-solid md:inline-block border-lightgray">
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
            <Categories />
            <div className="flex flex-wrap justify-center products">
              {products.map((product) => (
                <div key={product.url}>
                  <Product product={product} />
                </div>
              ))}
            </div> 
          </>
        )}
         <div className='p-3 bg-lime-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>
      </div>
    </div>
  );
}

export default Shoping;
