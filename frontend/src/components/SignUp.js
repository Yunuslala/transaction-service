
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "./Popup";

const SignUp = () => {
  const url="https://orderstockexchangebackend.onrender.com";
  const [email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setrole] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    if(!Name || !email || !password){
      return ErrorToast("Please fill all the fields")
    }
      const {data}=await axios.post(`${url}/api/v1/register`,{email,username:Name,password,role});
      if(data.success){
        SuccessToast(data.msg)
        navigate('/');
      }else{
        console.log("error",data);
        ErrorToast(data?.msg)
      }
    }catch(err){
   
        console.log("err",err);
        ErrorToast(err.response.data.msg);
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select  onChange={(e)=>setrole(e.target.value)}  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
          <div className="flex items-center justify-between mt-[10px]">
            Already SignUp?{" "}
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-sky-300"
            >
              SignUp
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
