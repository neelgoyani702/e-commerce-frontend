import React, { useState, useContext } from 'react'
import { AuthContext } from "../../context/AuthProvider";
import { User } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

function ProfileInfo() {

    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.phone || "" });
    const [editEnabled, setEditEnabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData.firstName || !userData.lastName) {
            toast.message('missing fields', {
                description: 'firstname and lastname are required',
            })
            return;
        }

        if (userData.phone && !/^[0-9]{10}$/.test(userData.phone)) {
            toast.message('invalid phone number', {
                description: 'phone number should be 10 digits long and contains only numbers',
            })
            return;
        }

        if (userData.firstName === user.firstName && userData.lastName === user.lastName && userData.phone === user.phone) {
            toast.message('no changes', {
                description: 'no changes made to the user',
            })
            return;
        }
        try {

            const toastId = toast.loading('updating user...');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include',
            });

            toast.dismiss(toastId);
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            else {
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('something went wrong');
        }
        setEditEnabled(false);
    }

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEditEnabled(false);
        setUserData({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.phone || "" });
        toast.message('changes discarded', {
            description: 'changes to the user have been discarded',
        })
    }

    return (
        <div className='py-2 px-4'>
            <div className='flex gap-2 justify-center items-center my-2'>
                < User size={30} className='border-2 border-black rounded-full' />
                <h1 className='text-3xl'>Personal Information</h1>
            </div>
            <div className='m-10'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center'>
                    <div className='grid grid-cols-2 gap-6'>
                        <div className="grid gap-2">
                            <Label
                                htmlFor="first-name">First name</Label>
                            <Input
                                value={userData.firstName}
                                onChange={handleChange}
                                className="py-5"
                                id="first-name"
                                name="firstName"
                                placeholder=""
                                disabled={!editEnabled}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label
                                htmlFor="last-name">Last name</Label>
                            <Input
                                value={userData.lastName}
                                onChange={handleChange}
                                className="py-5"
                                id="last-name"
                                name="lastName"
                                placeholder=""
                                disabled={!editEnabled}
                            />
                        </div>
                        <div className="col-span-2 grid gap-2">
                            <Label
                                htmlFor="email">email</Label>
                            <Input
                                value={userData.email}
                                disabled={true}
                                className="py-5"
                                id="email"
                                name="email"
                                placeholder=""
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label
                                htmlFor="phone">phone number</Label>
                            <Input
                                type="tel"
                                value={userData.phone}
                                onChange={handleChange}
                                className="py-5"
                                id="phone"
                                name="phone"
                                disabled={!editEnabled}
                                placeholder={userData.phone ? "" : "e.g. 9876543210"}
                            />
                        </div>
                        {/* <div className="grid gap-2">
                            <Label
                                htmlFor="phone">phone number</Label>
                            <Input
                                value={user?.phone || ""}
                                // onChange={handleChange}
                                className="py-5"
                                id="phone"
                                name="phone"
                                placeholder={user.phone ? "" : "Enter your phone number"}
                            />
                        </div> */}
                    </div>
                    <div className="flex gap-4">
                        {
                            !editEnabled &&
                            <Button
                                type="button"
                                className="border border-black text-base font-normal p-5"
                                onClick={() => {
                                    setEditEnabled(true);
                                    toast('now you can edit your profile');
                                }}>
                                Edit
                            </Button>
                        }
                        {
                            editEnabled &&
                            <>
                                <Button type='submit' className="border border-black text-base font-normal p-5">
                                    Save
                                </Button>
                                <Button type="reset" className="bg-white text-black border border-black text-base p-5 font-normal hover:bg-accent hover:text-accent-foreground" onClick={handleCancel}> cancel </Button>
                            </>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileInfo