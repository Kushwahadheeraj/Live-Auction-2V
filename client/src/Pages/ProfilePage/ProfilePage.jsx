import React, {
    useContext,
    useReducer,
    useState,
    useRef,
    useEffect,
  } from "react";
  import { Alert } from "flowbite-react";
  import { Helmet } from "react-helmet-async";
  import { Store } from "../../Store";
  import { getError } from "../../utils";
  import { toast } from "react-toastify";
  import axios from "axios";
  import { useParams } from "react-router-dom";
  import "./ProfilePage.css";
  import { CircularProgressbar } from "react-circular-progressbar";
  import { app } from "../../firebase";
  import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  
  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_REQUEST":
        return { ...state, loadingUpdate: true };
      case "UPDATE_SUCCESS":
        return { ...state, loadingUpdate: false };
      case "UPDATE_FAIL":
        return { ...state, loadingUpdate: false };
      default:
        return state;
    }
  };
  
  function ProfilePage() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sellerName, setSellerName] = useState(userInfo.seller?.name || "");
    const [sellerLogo, setSellerLogo] = useState(userInfo.seller?.logo || "");
  
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    // const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };
    useEffect(() => {
      if (imageFile) {
        uploadImage();
      }
    }, [imageFile]);
    const uploadImage = async () => {
      // service firebase.storage {
      //   match /b/{bucket}/o {
      //     match /{allPaths=**} {
      //       allow read;
      //       allow write: if
      //       request.resource.size < 2 * 1024 * 1024 &&
      //       request.resource.contentType.matches('image/.*')
      //     }
      //   }
      // }
      setImageFileUploading(true);
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError(
            "Could not upload image (File must be less than 2MB)"
          );
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setImageFileUploading(false);
          });
        }
      );
    };
  
    const [sellerDescription, setSellerDescription] = useState(
      userInfo.seller?.description || ""
    );
  
    const params = useParams();
    const { id: userId } = params;
  
    // eslint-disable-next-line no-unused-vars
    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
      loadingUpdate: false,
    });
  
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
      if (imageFileUploading) {
        setUpdateUserError("Please wait for image to upload");
        return;
      }
      try {
        const { data } = await axios.put(
          `/api/v2/users/profile/${userId}`,
          {
            name,
            email,
            password,
            sellerName,
            sellerLogo,
            sellerDescription,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: "UPDATE_SUCCESS",
        });
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Information Updated Successfully 👾");
      } catch (err) {
        dispatch({
          type: "UPDATE_FAIL",
        });
        toast.error(getError(err));
        setUpdateUserSuccess("User's profile updated successfully");
      }
      // signoutHandler();
    };
  
    // function signoutHandler() {
    //   ctxDispatch({ type: 'USER_SIGNOUT' });
    //   localStorage.removeItem('userInfo');
    //   localStorage.removeItem('shippingAddress');
    //   localStorage.removeItem('paymentMethod');
    //   window.location.href = '/signin';
    // }
  
    return (
      <div>
        <Helmet>
          <title>Profile</title>
        </Helmet>
        {/* component */}
        <div className="flex min-h-fit flex-col justify-center overflow-hidden bg-gray-100 py-6 sm:py-12">
          <div className="relative py-3 sm:mx-auto sm:max-w-xl">
            <div className="animate-spin-custom absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-cyan-300 to-cyan-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
            <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
              <div className="mx-auto max-w-md">
                <div>
                  <h1 className="text-2xl font-semibold">
                    User Profile - Edit your profile
                  </h1>
                </div>
                <div className="divide-y divide-gray-200">
                  <form
                    className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7"
                    onSubmit={submitHandler}
                  >
                    {/* ######################################## */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={filePickerRef}
                      hidden
                    />
                    <div
                      className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                      onClick={() => filePickerRef.current.click()}
                    >
                      {imageFileUploadProgress && (
                        <CircularProgressbar
                          value={imageFileUploadProgress || 0}
                          text={`${imageFileUploadProgress}%`}
                          strokeWidth={5}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            },
                            path: {
                              stroke: `rgba(62, 152, 199, ${
                                imageFileUploadProgress / 100
                              })`,
                            },
                          }}
                        />
                      )}
                      <img
                        src={imageFileUrl || userInfo.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                          imageFileUploadProgress &&
                          imageFileUploadProgress < 100 &&
                          "opacity-60"
                        }`}
                      />
                    </div>
                    {imageFileUploadError && (
                      <Alert color="failure">{imageFileUploadError}</Alert>
                    )}
                    {/* ############################### */}
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="name"
                        name="name"
                        type="text"
                        className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <label
                        htmlFor="name"
                        className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                      >
                        Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="email"
                        className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label
                        htmlFor="email"
                        className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                      >
                        Email Address
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        htmlFor="password"
                        className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="confirmPassword"
                        name="password"
                        type="password"
                        className="focus:border-rose-600 peer mb-4 h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                        placeholder="Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                      >
                        Confirm Password
                      </label>
                    </div>
  
                    {userInfo.isSeller && (
                      <>
                        <h2 className="text-2xl font-semibold">
                          Seller Profile - Edit seller profile
                        </h2>
                        <div className="relative pt-4">
                          <input
                            autoComplete="off"
                            id="sellerName"
                            name="sellerName"
                            type="text"
                            className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                            placeholder="Seller Name"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            required
                          />
                          <label
                            htmlFor="sellerName"
                            className="peer-placeholder-shown:text-gray-440 mt-4 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                          >
                            Seller Name
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="sellerLogo"
                            name="sellerLogo"
                            type="text"
                            className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                            placeholder="Seller Logo"
                            value={sellerLogo}
                            onChange={(e) => setSellerLogo(e.target.value)}
                            required
                          />
                          <label
                            htmlFor="sellerLogo"
                            className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                          >
                            Seller Logo
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="sellerDescription"
                            name="sellerDescription"
                            type="text"
                            className="focus:border-rose-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none text-base"
                            placeholder="Seller Description"
                            value={sellerDescription}
                            onChange={(e) => setSellerDescription(e.target.value)}
                            required
                          />
                          <label
                            htmlFor="sellerDescription"
                            className="peer-placeholder-shown:text-gray-440 absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                          >
                            Seller Description
                          </label>
                        </div>
                      </>
                    )}
                    <div className="relative">
                      <button
                        type="submit"
                        className="rounded-md mt-4 w-full bg-cyan-500 px-2 py-1 text-white duration-200 hover:bg-cyan-600"
                      >
                        Update
                      </button>
                      <div className="px-2 w-full text-sm text-center border rounded-md mt-2 bg-gray-100 text-gray-700">
                        User will be logged out in order to apply changes.
                      </div>
                    </div>
                  </form>
                  {updateUserSuccess && (
                    <Alert color="success" className="mt-5">
                      {updateUserSuccess}
                    </Alert>
                  )}
                  {updateUserError && (
                    <Alert color="failure" className="mt-5">
                      {updateUserError}
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProfilePage;
  