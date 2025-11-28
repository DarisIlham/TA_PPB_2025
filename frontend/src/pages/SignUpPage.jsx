// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import back from "../img/return.png";

const SignUpPage = ({ setUserProfile }) => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Set user profile di context dan local state setelah signup berhasil
        const newUserProfile = {
          name: formData.name,
          email: formData.email,
          age: 0,
          weight: 0,
          height: 0,
          unit: "kg",
          distanceUnit: "km"
        };
        
        
        // Redirect setelah success
        navigate("/");
      } else {
        const errorData = await res.json();
        alert("Sign up failed: " + errorData.message);
      }
    } catch (error) {
      alert("Error connecting to server: " + error.message);
    }
  };

  const handleSign = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const backSign = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute z-10 w-full flex min-h-screen justify-center">
        <div className="text-[16px] leading-[18px]">
          <div className="text-[18px] mt-[44px] mb-[56px] justify-center grid place-items-center w-[375px] h-[64px] text-center font-semibold">
            <button className="absolute left-[20px]" onClick={backSign}>
              <img src={back} alt="Back" className="w-[24px] h-[24px]" />
            </button>
            <p className="font-semibold text-[18px]">Sign Up</p>
          </div>

          <form className="mx-[16px] items-center" onSubmit={handleSubmit}>
            <div className="flex mb-[24px] w-[343px] h-[56px] items-center border rounded-[16px] py-[8px] px-[16px] gap-[10px]">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="my-1 outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex mb-[24px] w-[343px] h-[56px] items-center border rounded-[16px] py-[8px] px-[16px] gap-[10px]">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex mb-[24px] w-[343px] h-[56px] items-center border rounded-[16px] py-[8px] px-[16px] gap-[10px]">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
                required
              />
              <span className="mr-2 text-2xl cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>

            <div className="flex items-center mb-[24px]">
              <input
                type="checkbox"
                className="w-[32px] h-[32px] mr-[10px] accent-[#42AB39]"
                required
              />
              <label className="text-[14px] text-[#000000] font-medium lg:w-[250px]">
                By signing up, you agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="text-[18px] leading-[100%] bg-[#42AB39] hover:bg-white hover:text-black text-white mb-[24px] w-[343px] h-[56px] py-[8px] px-[16px] gap-[10px] rounded-[16px] font-semibold"
            >
              Sign Up
            </button>

            <div className="text-center text-[#91919F] cursor-pointer font-medium">
              Already have an account?{" "}
              <a className="text-[#42AB39] underline" onClick={handleSign}>
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;