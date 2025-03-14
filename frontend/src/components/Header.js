import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Controller from "../hooks/controller";
import "../style/header.css";
import { RiAccountCircleFill } from "react-icons/ri";

function Header() {
  const navigate = useNavigate();
  const { userDetail, logout } = Controller(); 
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHidden(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      <div className="header-title" onClick={() => navigate("/home")}>
        <h1>CinemaZone</h1>
      </div>
      <div className="button-container">
        <div className="headerleftside">
          {userDetail ? (
            <div className="dropdown" ref={dropdownRef}>
        
              <button className="account" onClick={() => setHidden(!hidden)}>
                <RiAccountCircleFill size={40} />
              </button>
                 
           
              <nav style={{ display: hidden ? "none" : "flex" }} className="option">
                <div
                  onClick={() => {
                    navigate("/profile"); 
                    setHidden(true);
                  }}
                >
                  Profile
                </div>
                <div
                  onClick={() => {
                    logout();
                    setHidden(true);
                  }}
                >
                  Logout
                </div>
              </nav>
            </div>
          ) : (
            <>
              <div className="button" onClick={() => navigate("/signup")}>
                Signup
              </div>
              <div className="button" onClick={() => navigate("/Login")}>
                Login
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
