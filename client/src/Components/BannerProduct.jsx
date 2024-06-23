import React, { useEffect, useState } from 'react';
import image1 from "../Image/istockphoto-1061275982-612x612.jpg";
import image2 from "../Image/pexels-katrin-bolovtsova-6077326.jpg";
import image3 from "../Image/istockphoto-1361391123-612x612.jpg";
import image4 from '../Image/img4.jpg';
import image5 from '../Image/img5.webp'


import image1Mobile from '../Image/img1_mobile.jpg'
import image2Mobile from '../Image/img2_mobile.webp'
import image3Mobile from '../Image/img3_mobile.jpg'
import image4Mobile from '../Image/img4_mobile.jpg'
import image5Mobile from '../Image/img5_mobile.png'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";


const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () =>{
        if(desktopImages.length - 1 > currentImage){
            setCurrentImage(preve => preve + 1)
        }
    }

    const preveImage = () =>{
        if(currentImage !== 0){
            setCurrentImage(preve => preve - 1)
        }
    }


    useEffect(()=>{
        const interval = setInterval(()=>{
            if(desktopImages.length - 1 > currentImage){
                nextImage()
            }else{
                setCurrentImage(0)
            }
        },5000)

        return ()=> clearInterval(interval)
    },[currentImage])

  return (
    <div className='container px-4 mx-auto rounded '>
        <div className='relative w-full h-56 md:h-72 bg-slate-200'>

                <div className='absolute z-10 items-center hidden w-full h-full md:flex '>
                    <div className='flex justify-between w-full text-2xl '>
                        <button onClick={preveImage} className='p-1 bg-white rounded-full shadow-md'><FaAngleLeft/></button>
                        <button onClick={nextImage} className='p-1 bg-white rounded-full shadow-md'><FaAngleRight/></button> 
                    </div>
                </div>

                {/**desktop and tablet version */}
              <div className='hidden w-full h-full overflow-hidden md:flex'>
                {
                        desktopImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-full'/>
                            </div>
                            )
                        })
                }
              </div>


                {/**mobile version */}
                <div className='flex w-full h-full overflow-hidden md:hidden'>
                {
                        mobileImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='object-cover w-full h-full'/>
                            </div>
                            )
                        })
                }
              </div>


        </div>
    </div>
  )
}

export default BannerProduct