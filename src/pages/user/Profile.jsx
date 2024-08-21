import React, { useContext, useEffect } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import AccountSidebar from '../../components/AccountSidebar.jsx'
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Profile() {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // console.log("user", user);
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className='py-32 md:py-20'>
      <h1 className='font-[Caveat] font-extrabold text-5xl m-12'>My Account</h1>
      <div className='flex flex-row gap-10 my-8 mx-12'>
        <div className='w-60 border'>
          <div className='border-b mb-5 flex flex-col gap-2 justify-center items-center p-2'>
            <img src={user.image} width={100} height={100} alt="user" className='rounded-full w-auto h-auto' />
            <h3 className='font-medium text-xl break-words'>{user.firstName} {user.lastName}</h3>
          </div>
          <AccountSidebar />
        </div>
        <div className='flex-1 border py-2 px-4'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Profile