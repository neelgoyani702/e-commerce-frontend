import React, { useState, useRef, useContext } from 'react'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { AuthContext } from '../context/AuthProvider'

function AddAdress({ handleAddAddress }) {

    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        houseNo: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        country: 'India'
    });
    const [pinCode, setPinCode] = useState('');

    const { user } = useContext(AuthContext);

    const ref = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!address.fullName) {
            if (user.firstName) {
                setAddress({
                    ...address,
                    fullName: `${user.firstName} ${user.lastName}`
                });
            } else {
                toast.message('full name is required as it is not provided in your profile as well');
                return;
            }
        }

        if (!address.phone) {
            if (user.phone) {
                setAddress({
                    ...address,
                    phone: user.phone
                });
            } else {
                toast.message('phone number is required as it is not provided in your profile as well');
                return;
            }
        }

        if (address.phone && !/^[0-9]{10}$/.test(address.phone)) {
            toast.message('invalid phone number', {
                description: 'phone number should be 10 digits long and contains only numbers',
            })
            return;
        }

        try {

            const toastId = toast.loading('adding address...');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/add-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...address, pinCode }),
                credentials: 'include',
            });
            toast.dismiss(toastId);

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            else {
                handleAddAddress(data.address);
                toast.success(data.message);
                ref.current.click();
                // navigate(0);
            }

        } catch (error) {
            console.log("error in adding address", error);
            toast.error("something went wrong");
        }

        setAddress({
            fullName: '',
            phone: '',
            houseNo: '',
            landmark: '',
            area: '',
            city: '',
            state: '',
            country: 'India'
        });

    }

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handlePinCodeChange = async (e) => {
        // console.log(e.target.value);
        setPinCode(e.target.value);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                if (data[0]?.PostOffice?.length > 0) {
                    setAddress({
                        ...address,
                        city: data[0].PostOffice[0].Block,
                        state: data[0].PostOffice[0].State
                    });
                } else {
                    setAddress({
                        ...address,
                        city: '',
                        state: ''
                    });
                }
            }
        } catch (error) {
            console.log("error in fetching city", error);
        }

    }

    return (
        <DialogContent className="px-10 max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Add Address</DialogTitle>
                <DialogDescription>
                    Add your address to get your order delivered to your doorstep
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center my-4'>
                <div className='grid grid-cols-2 gap-y-5 gap-x-2'>
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            value={address.fullName}
                            onChange={handleChange}
                            className="py-5"
                            id="fullName"
                            name="fullName"
                            placeholder="person who will receive the order"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                            value={address.phone}
                            onChange={handleChange}
                            type="tel"
                            className="py-5"
                            id="phone"
                            name="phone"
                            placeholder="phone number of receiver"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="hfa">House no., Flat, Apartment</Label>
                        <Input
                            value={address.houseNo}
                            onChange={handleChange}
                            className="py-5"
                            id="hfa"
                            name="houseNo"
                            placeholder=""
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                            value={address.landmark}
                            onChange={handleChange}
                            className="py-5"
                            id="landmark"
                            name="landmark"
                            placeholder=""
                        />
                    </div>
                    <div className="grid col-span-2 gap-2">
                        <Label htmlFor="asv">Area, Street, Village *</Label>
                        <Input
                            value={address.area}
                            onChange={handleChange}
                            className="py-5"
                            id="asv"
                            name="area"
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pinCode">Pin Code *</Label>
                        <Input
                            value={pinCode}
                            onChange={handlePinCodeChange}
                            className="py-5"
                            id="pinCode"
                            name="pinCode"
                            placeholder=""
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                            value={address.city}
                            onChange={handleChange}
                            className="py-5"
                            id="city"
                            name="city"
                            placeholder=""
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                            value={address.state}
                            onChange={handleChange}
                            className="py-5"
                            id="state"
                            name="state"
                            placeholder=""
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            value={address.country || "India"}
                            onChange={handleChange}
                            disabled={true}
                            className="py-5"
                            id="country"
                            name="country"
                            placeholder=""
                        />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="text-base border border-black font-normal p-5 hover:bg-accent hover:text-accent-foreground duration-500"
                        >
                            Save
                        </Button>
                    </div>
                    <DialogClose asChild className="hidden">
                        <Button type="button" variant="secondary" ref={ref}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default AddAdress