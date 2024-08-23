import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import { toast } from 'sonner';
import { MapPinnedIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
} from "../../components/ui/dialog"
import AddAdress from "../../components/AddAddress";
import DeleteUpdateAddress from '../../components/DeleteUpdateAddress';

function UserAddress() {

    const { user } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {

        const getAddress = async () => {

            try {

                if (addresses.lengh > 0) {
                    toast.message('addresses already fetched');
                    return;
                }

                const toastId = toast.loading('getting addresses...');

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
                    // toast.success(data.message);
                    setAddresses(data.address);
                }

            } catch (e) {
                console.log("Error: in get address", e);
                toast.error("Error in getting address");
            }

        }

        getAddress();

    }, [user, addresses.lengh]);

    const handleAddAddress = (address) => {
        setAddresses([...addresses, address]);
    }

    const handleUpdateAddress = (address) => {
        const updatedAddresses = addresses.map((a) => (a._id === address._id ? address : a));
        setAddresses(updatedAddresses);
    }

    const handleDeleteAddress = (address) => {
        const updatedAddresses = addresses.filter((a) => (a._id !== address._id));
        setAddresses(updatedAddresses);
    }

    return (
        <div className='py-2 px-4 flex justify-center flex-col'>
            <div className='flex gap-5 justify-center items-center my-2'>
                < MapPinnedIcon size={30} className='rounded-full' />
                <h1 className='text-3xl'>Your Addresses</h1>
            </div>
            <div className='m-10 flex gap-6 justify-start flex-wrap'>
                <div>
                    <Dialog>
                        <DialogTrigger>
                            <div className='w-72 h-60 border-2 border-dashed cursor-pointer flex flex-col justify-center items-center'>
                                <Plus size={50} className='m-5 text-slate-300' />
                                <h3 className='text-lg text-slate-600'>Add Address</h3>
                            </div>
                        </DialogTrigger>
                        <AddAdress handleAddAddress={handleAddAddress} />
                    </Dialog>
                </div>

                {
                    addresses.map((address) => (
                        <div key={address._id} className='w-72 h-60 border-2 flex flex-col justify-between'>
                            <div className='m-5'>
                                <h3 className='font-semibold'>{address.fullName || user.firstName}</h3>
                                <div className='text-sm'>
                                    {address?.houseNo && <p> Home No. {address.houseNo}</p>}
                                    {address?.area && <p>{address.area}</p>}
                                    <>
                                        {address?.city && <span>{address.city}</span>},
                                        {address?.state && <span> {address.state}</span>},
                                        {address?.pinCode && <span> {address.pinCode}</span>}
                                    </>
                                    {address?.country && <p>{address.country}</p>}
                                    {address?.phone && <p>phone number : {address.phone || user.phone}</p>}
                                </div>
                            </div>
                            <DeleteUpdateAddress address={address} handleUpdateAddress={handleUpdateAddress} handleDeleteAddress={handleDeleteAddress} />
                        </div>
                    )
                    )
                }
            </div>
        </div >
    )
}

export default UserAddress