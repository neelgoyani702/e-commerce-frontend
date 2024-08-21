import React, { useContext } from 'react'
import { AuthContext } from "../../context/AuthProvider";

function ProfileInfo() {

    const { user } = useContext(AuthContext);
    // console.log(user);
    

    return (
        <div>ProfileInfo</div>
    )
}

export default ProfileInfo