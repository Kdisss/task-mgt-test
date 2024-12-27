import React, { useState } from 'react'
import "./Auth.css"
import Signin from './Signin';
import Signup from './Signup';

const Auth = () => {
    const [isRegister,setIsRegister]=useState(false);
    const togglePanel=()=>{
        setIsRegister(!isRegister)
    }
  return (
    <div className='flex items-center justify-center h-screen overflow-hidden'>
      <div className='box lg:max-w-41'>
            <div className={`cover ${isRegister?"rotate-active":""}`}>
                    <div className="front">
                                <img 
                                    src="https://wallpapersok.com/images/hd/blue-aesthetic-surface-wave-s19ahl2souzb19ka.jpg" 
                                    alt="" 
                                />
                                <div className="text">
                                    <span className="text-1">
                                        Success Is Built Upon Well Organized Tasks
                                    </span>
                                    <span className="text-xs text-2">
                                        Let's Get Connected
                                    </span>
                                </div>
                    </div>
                    <div className="back">
                                <img 
                                    src="https://e0.pxfuel.com/wallpapers/227/21/desktop-wallpaper-light-blue-aesthetic-background-tip-sky-blue-aesthetic.jpg" 
                                    alt="" 
                                />
                                <div className="text">
                                    <span className="text-1">
                                        Success Is Built Upon Well Organized Tasks
                                    </span>
                                    <span className="text-xs text-2">
                                        Let's Get Connected
                                    </span>
                                </div>
                    </div>
            </div>
                <div className="h-full forms">
                    <div className="h-full form-content">
                        <div className='login-form'>
                            <Signin togglePanel={togglePanel}/>
                        </div>
                        <div className='signup-form'>
                            <Signup togglePanel={togglePanel}/>
                        </div>
                    </div>
                </div>
        </div>
    </div>

  )
}

export default Auth
