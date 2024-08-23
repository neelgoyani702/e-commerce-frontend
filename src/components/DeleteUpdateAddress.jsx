import React, { useRef, useState, useContext } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { AuthContext } from '../context/AuthProvider'

function DeleteUpdateAddress({ address, handleUpdateAddress, handleDeleteAddress }) {

    const [editedAddress, setEditedAddress] = useState({
        fullName: address.fullName,
        phone: address.phone,
        houseNo: address.houseNo,
        landmark: address.landmark,
        area: address.area,
        city: address.city,
        state: address.state,
        country: 'India'
    });

    const [pinCode, setPinCode] = useState(address.pinCode);

    const { user } = useContext(AuthContext);
    const ref = useRef(null);

    // Edit address
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editedAddress.fullName) {
            if (user.firstName) {
                editedAddress({
                    ...address,
                    fullName: `${user.firstName} ${user.lastName}`
                });
            } else {
                toast.message('full name is required as it is not provided in your profile as well');
                return;
            }
        }

        if (!editedAddress.phone) {
            if (user.phone) {
                setEditedAddress({
                    ...address,
                    phone: user.phone
                });
            } else {
                toast.message('phone number is required as it is not provided in your profile as well');
                return;
            }
        }

        if (editedAddress.phone && !/^[0-9]{10}$/.test(editedAddress.phone)) {
            toast.message('invalid phone number', {
                description: 'phone number should be 10 digits long and contains only numbers',
            })
            return;
        }

        if (address.fullName === editedAddress.fullName && address.phone === editedAddress.phone && address.houseNo === editedAddress.houseNo && address.landmark === editedAddress.landmark && address.area === editedAddress.area && address.city === editedAddress.city && address.state === editedAddress.state && address.country === editedAddress.country && address.pinCode === pinCode) {
            toast.message('no changes', {
                description: 'no changes made to the address',
            })
            return;
        }

        try {

            const toastId = toast.loading('editing address...');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update-address/${address._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editedAddress, pinCode }),
                credentials: 'include',
            });
            toast.dismiss(toastId);

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            else {
                handleUpdateAddress(data.address);
                toast.success(data.message);
                ref.current.click();
            }

        } catch (error) {
            console.log("error while updating address", error);
            toast.error("something went wrong");
        }

    }

    const handleChange = (e) => {
        setEditedAddress({
            ...editedAddress,
            [e.target.name]: e.target.value
        })
    }

    const handlePinCodeChange = async (e) => {
        console.log(e.target.value);
        setPinCode(e.target.value);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${e.target.value}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data[0]?.PostOffice?.length > 0) {
                    setEditedAddress({
                        ...editedAddress,
                        city: data[0].PostOffice[0].Block,
                        state: data[0].PostOffice[0].State
                    });
                } else {
                    setEditedAddress({
                        ...editedAddress,
                        city: '',
                        state: ''
                    });
                }
            }
        } catch (error) {
            console.log("error in fetching city", error);
        }

    }

    // Delete address
    const haldleDelete = async (e) => {

        try {

            const toastId = toast.loading('deleting address...');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/delete-address/${address._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            toast.dismiss(toastId);

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            handleDeleteAddress(address);
            toast.success(data.message);

        } catch (error) {
            console.log("error in deleting address", error);
            toast.error("something went wrong");
        }

    }

    return (
        <div className='h-16 border-t flex items-center gap-2 mx-5'>

            <Dialog>
                <DialogTrigger>
                    <Button type='button' className="border border-black text-sm hover:bg-white hover:text-black duration-500">
                        Edit
                    </Button>
                </DialogTrigger>
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
                                    value={editedAddress.fullName}
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
                                    value={editedAddress.phone}
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
                                    value={editedAddress.houseNo}
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
                                    value={editedAddress.landmark}
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
                                    value={editedAddress.area}
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
                                    value={editedAddress.city}
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
                                    value={editedAddress.state}
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
                                    value={editedAddress.country || "India"}
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
            </Dialog>

            <Button type="button" onClick={haldleDelete} className="bg-white text-black border border-black text-sm font-normal hover:bg-accent hover:text-accent-foreground" > Remove </Button>
        </div>
    )
}

export default DeleteUpdateAddress


