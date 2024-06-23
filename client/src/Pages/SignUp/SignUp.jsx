import React, { useContext, useEffect, useState } from "react";
import { Spinner} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import wave from "./Assets/wave.png";
import avatar from "./Assets/avatar.svg";
import unlock from "./Assets/unlock.svg";
import axios from "axios";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getError } from "../../utils";
import OAuth from "../../Components/OAuth";

function RegisterPage() {
  const [showModal, setShowModal] = React.useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  

  const submitHandler = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one uppercase,lowercase letter, and one special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v2/auth/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="relative">
      <ToastContainer position="bottom-center" limit={1} />
      <Helmet>
        <title>Sign Up-Live Auction</title>
      </Helmet>

      <h2 className="absolute top-[5%] right-[5%] text-3xl font-bold">
        <Link to={"/"}>
          <i className="delay-500 fas fa-times text-cyan-500 hover:animate-pulse"></i>
        </Link>
      </h2>

      <img
        src={wave}
        alt="wave"
        className="fixed inset-0 hidden h-full lg:block"
        style={{ zIndex: "-1" }}
      />
      <div className="flex flex-col items-center justify-center w-screen h-screen lg:grid lg:grid-cols-2">
        <img
          src={unlock}
          className="hidden lg:block w-1/2 hover:scale-150 transition-all duration-500 transform scale-x-[-1] mx-auto"
          alt="unlock"
        />
        <form
          className="flex flex-col items-center justify-center w-1/2"
          onSubmit={submitHandler}
        >
          <img
            src={avatar}
            className="w-32 transition-all duration-500 transform scale-x-[-1]"
            alt="avatar"
          />
          <h2 className="my-8 text-3xl font-bold text-center text-gray-700 font-display">
            Register
          </h2>
          <div className="relative font-sans">
            <i className="absolute fa fa-user-tie text-primarycolor"></i>
            <input
              type="text"
              placeholder="Name"
              className="w-64 pl-8 transition-all duration-500 border-b-2 outline-none font-display focus:border-primarycolor"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative mt-8 font-sans">
            <i className="absolute fa fa-envelope text-primarycolor"></i>
            <input
              type="email"
              placeholder="Email"
              className="w-64 pl-8 transition-all duration-500 border-b-2 outline-none font-display focus:border-primarycolor"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mt-8 font-sans">
            <i className="absolute fa fa-lock text-primarycolor"></i>
            <input
              type="password"
              placeholder="Password"
              className="w-64 pl-8 transition-all duration-500 border-b-2 outline-none font-display focus:border-primarycolor"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="relative mt-8 font-sans">
            <i className="absolute fa fa-shield-alt text-primarycolor"></i>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-64 pl-8 transition-all duration-500 border-b-2 outline-none font-display focus:border-primarycolor"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="relative mt-8 font-sans">
            <input
              id="default-checkbox"
              type="checkbox"
              required
              value={true}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
            >
              I agree to these

    <>
    <Link
        onClick={() => setShowModal(true)}
    className="ms-2 text-blue-700" >Tarms & Canditions</Link>
      {/* <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
      >
        Open small modal
      </button> */}
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Terms & Condition
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    I accept
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Decline
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
              
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-20 py-3 mt-1 text-lg font-semibold text-white uppercase transition-all duration-500 transform rounded-full bg-primarycolor hover:translate-y-1"
          >
             {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            {/* Register */}
          </button>
          
          <OAuth/>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to={`/signin?redirect=${redirect}`} 
            className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default RegisterPage;
