import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <div className='flex flex-col items-center justify-center p-3 text-center border border-teal-500 sm:flex-row rounded-tl-3xl rounded-br-3xl'>
        <div className="flex flex-col justify-center flex-1">
            <h2 className='text-5xl'>
                All Auction Product 
            </h2>
            
            <Link to="/auction" className="bg-cyan-500 hover:bg-cyan-600 ... rounded-bl-none  rounded-tl-xl ">
            <span className="relative inline-flex items-center rounded px-2.5 py-1.5 font-medium">
                <span className="ml-1.5 text-3xl text-white-600 hover:text-gray-900">
                  Auction
                </span>
              </span>
            </Link>
        </div>
        <div className="flex-1 p-7">
            <img src="https://firebasestorage.googleapis.com/v0/b/mern-auction.appspot.com/o/pexels-sora-shimazaki-5668473.jpg?alt=media&token=9643974f-2f9b-458e-86f8-9d2a3dc48ed7" />
        </div>
    </div>
  )
}