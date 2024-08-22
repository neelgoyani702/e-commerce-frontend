import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { MapPinnedIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

function UserAddress() {

    const { user } = useContext(AuthContext);
    const [address, setAddress] = useState([]);

    useEffect(() => {

        const getAddress = async () => {

            try {

                if (address.lengh > 0) {
                    toast.message('address already fetched');
                    return;
                }

                const toastId = toast.loading('getting address...');

                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get-address`, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                toast.dismiss(toastId);

                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message);
                    return;
                }

                if (data.address) {
                    console.log(data.address);
                    toast.success(data.message);
                    setAddress(data.address);
                }

            } catch (e) {
                console.log("Error: in get address", e);
                toast.error("Error in getting address");
            }

        }

        getAddress();

    }, [user,address.lengh]);

    return (
        <div className='py-2 px-4'>
            <div className='flex gap-5 justify-center items-center my-2'>
                < MapPinnedIcon size={30} className='rounded-full' />
                <h1 className='text-3xl'>Your Addresses</h1>
            </div>
            <div className='m-10 flex gap-6 justify-between flex-wrap'>
                <div>
                    <div className='w-72 h-60 border-2 border-dashed cursor-pointer flex flex-col justify-center items-center'>
                        <Plus size={50} className='m-5 text-slate-300' />
                        <h3 className='text-lg text-slate-600'>Add Address</h3>
                    </div>
                </div>

                {
                    address.map((address) => (
                        <div key={address._id} className='w-72 h-60 border-2 flex flex-col justify-between'>
                            <div className='m-5'>
                                <h3 className='font-bold text-lg'>{user.firstName} {user.lastName}</h3>
                                <div className=''>
                                    {address?.houseNo && <p> Home No. {address.houseNo}</p>}
                                    {address?.area && <p>{address.area}</p>}
                                    <>
                                        {address?.city && <span>{address.city}</span>},
                                        {address?.state && <span> {address.state}</span>},
                                        {address?.pinCode && <span> {address.pinCode}</span>}
                                    </>
                                    {address?.country && <p>{address.country}</p>}
                                </div>
                            </div>
                            <div className='h-16 border-t flex items-center gap-2 mx-5'>
                                <Button type='button' className="border border-black text-sm hover:bg-white hover:text-black duration-500">
                                    Edit
                                </Button>
                                <Button type="button" className="bg-white text-black border border-black text-sm font-normal hover:bg-accent hover:text-accent-foreground" > Remove </Button>
                            </div>
                        </div>
                    )
                    )
                }
            </div>
        </div >
    )
}

export default UserAddress