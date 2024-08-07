import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { loginWithRedirect, logout } = useAuth0();
    const { user, isAuthenticated, isLoading } = useAuth0();


    return (
        <>
            <div className='flex justify-around items-center bg-[#202c37] p-3'>
                <div className="name flex gap-2">
                    <img src="" alt="logo" />
                    <div className='font-serif text-2xl text-white'>Navo Vyapar</div>
                </div>
                {!user && <div className='flex gap-4'>
                <Button gradientMonochrome="teal" onClick={() => loginWithRedirect()}>Login</Button>
                <Button gradientMonochrome="teal" onClick={() => loginWithRedirect()}>Sign up</Button>
                </div>}
                {user && <div className='flex gap-4 items-center'>
                    <div className='text-white font-medium'> Hello, {user.name}</div>
                    <Button gradientMonochrome="teal" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Sign Out</Button>
                </div> }
            </div>
        </>
    )
}

export default Navbar
