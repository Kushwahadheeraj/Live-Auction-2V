import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./Pages/Home/Home";
import Header from "./Pages/Header/Header";
import Footer from "./Pages/Footer/Footer";
import ProductItems from "./Pages/ProductItems/ProductItems";
import LoginPage from "./Pages/SignIn/SignIn";
import RegisterPage from "./Pages/SignUp/SignUp.jsx";
import CartPage from "./Pages/CartPage/CartPage";
import OrderPage from "./Pages/OrderPage/OrderPage.jsx";
import AddressPage from "./Pages/AddressPage/AddressPage";
import PaymentMethod from "./Pages/PaymentMethod/PaymentMethod";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import OrderHistory from "./Pages/OrderHistory/OrderHistory";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import SearchPage from "./Pages/SearchPage/SearchPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminRoute from "./Components/AdminRoute/AdminRoute";
import ProductListPage from "./Pages/ProductListPage/ProductListPage";
import ProductEditPage from "./Pages/ProductEditPage/ProductEditPage";
import OrderListPage from "./Pages/OrderListPage/OrderListPage";
import UserListPage from "./Pages/UserListPage/UserListPage";
import UserEditPage from "./Pages/UserEditPage/UserEditPage";
import SellerRoute from "./Components/SellerRoute/SellerRoute";
import Auction from "./Pages/Auction/Auction";
import CreateAuction from "./Pages/CreateAuction/CreateAuction";
import AuctionDetail from "./Pages/AuctionDetails/AuctionDetail";
import ScrollToTop from "./Components/ScrollToTop";
import Shoping from "./Pages/Shoping/Shoping"
import AuctionAddressPage from "./Pages/AuctionAddressPage/AuctionAddressPage";
import AuctionOrderPage from "./Pages/AuctionOrderPage/AuctionOrderPage";
import AuctionPlaceOrder from "./Pages/AuctionPlaceOrder/AuctionPlaceOrder";
import AuctionPaymentMethod from "./Pages/AuctionPaymentMethod/AuctionPaymentMethod";
import AuctionCartPage from "./Pages/AuctionCartPage/AuctionCartPage";



// Set the base URL for all axios requests
axios.defaults.baseURL =
  process.env.REACT_APP_API_PROXY || "http://localhost:5000";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={
            <>
              <Home />
              <Footer />
            </>
          }/>
        <Route path="/shoping" element={
            <>
              <Shoping />
              <Footer />
            </>
          }/>
        <Route path="/products/:url" element={
            <>
              <ProductItems />
              <Footer />
            </>
          }/>
        <Route path="/cart" element={
            <>
              <CartPage />
              <Footer />
            </>
          }/>
        <Route path="/auctioncart" element={
            <>
              <AuctionCartPage />
              <Footer />
            </>
          }/>
        <Route path="/signin" element={<LoginPage /> } />
        <Route path="/signup" element={<RegisterPage />}/>
        <Route path="/shipping" element={<AddressPage />}/>
        <Route path="/auctionshipping" element={<AuctionAddressPage />}/>
        <Route path="/payment" element={<PaymentMethod />}/>
        <Route path="/auctionpayment" element={<AuctionPaymentMethod />}/>
        <Route path="/placeorder" element={<PlaceOrder />}/>
        <Route path="/auctionplaceorder" element={<AuctionPlaceOrder />}/>
        <Route path="/order/:id" element={
            <>
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            </>
          }/>
        <Route path="/auctionorder/:id" element={<AuctionOrderPage />}/>
        <Route path="/orderhistory" element={
            <>
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            </>
          }/>
        <Route path="/profile" element={
            <>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </>
          }/>
        <Route path="/search" element={<SearchPage />}/>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
            <>
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            </>
          }/>
        <Route path="/admin/products" element={
            <>
              <AdminRoute>
                <ProductListPage />
              </AdminRoute>
            </>
          }  exact/>

        <Route path="/admin/product/:id" element={
            <>
              <AdminRoute>
                <ProductEditPage />
              </AdminRoute>
            </>
          }/>
        <Route path="/admin/orders" element={
            <>
              <AdminRoute>
                <OrderListPage />
              </AdminRoute>
            </>
          } exact/>
        <Route path="/admin/users" element={
            <>
              <AdminRoute>
                <UserListPage />
              </AdminRoute>
            </>}/>
        <Route path="/admin/user/:id" element={
            <>
              <AdminRoute>
                <UserEditPage />
              </AdminRoute>
            </>
          }/>
        {/* Seller Routes */}
        <Route path="/seller/products" element={
            <>
              <SellerRoute>
                <ProductListPage />
              </SellerRoute>
            </>
          }/>
        <Route path="/seller/orders" element={
            <>
              <SellerRoute>
                <OrderListPage />
              </SellerRoute>
            </>
          }/>
        <Route path="/auction" element={<Auction />}/>
        <Route path="/create-auction" element={<CreateAuction />}/>
        <Route path="/auctions/:id" element={<AuctionDetail />}/>

      </Routes>
    </Router>
  );
}

export default App;
