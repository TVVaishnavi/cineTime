import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Profile.css";

const Profile = ({ userId }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        
            try {
                const user =localStorage.getItem("userdetail");
                if (user) {
                    setUser(JSON.parse(user));
                    console.log(user)
                } else {
                    console.log("no user");
                }
            } catch (error) {
                console.error("Error retrieving user:", error);
            }
        
    }, [])

    return (
        <div className="profile">
            <h2>{user.name}'s Profile</h2>
            <img src={user.profilePicture || "default-profile.png"} alt="Profile" className="profile-pic" />
            <div>User:{user.name}</div>
            <div>Email:{user.email}</div>

            
        </div>
    );
};

export default Profile;
