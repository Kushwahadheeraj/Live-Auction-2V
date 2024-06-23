

// export default function OAuth() {
//     const googleAuth = () => {
// 		window.open(
// 			`${process.env.REACT_APP_API_PROXY}/api/v2/users/google/callback`,
// 			"_self"
// 		);
// 	};
   
//   return (
// <button className="px-20 py-3 mt-1 text-lg font-semibold text-white uppercase transition-all duration-500 transform rounded-full bg-primarycolor hover:translate-y-1" onClick= { googleAuth}>
// {/* <img src="./images/google.png" alt="google icon" /> */}
// <span>Sing up with Google</span>
// </button>
//   )
// }

import React, { useContext } from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { Store } from '../Store';
import { useNavigate,useLocation } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app)
    // const dispatch = useDispatch()
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
	const {  dispatch: ctxDispatch } = useContext(Store);
    const navigate = useNavigate()
    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/v2/users/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            if (res.ok){
                ctxDispatch({ type: 'USER_SIGNIN', payload: data });
				navigate(redirect || "/");
                // navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}