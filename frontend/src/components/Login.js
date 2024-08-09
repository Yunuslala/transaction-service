import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorToast, SuccessToast,  } from './Popup';




const Login = () => {
     const url="https://orderstockexchangebackend.onrender.com"

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const {data}=await axios.post(`${url}/api/v1/login`,formData);
      if(data.success){
        SuccessToast(data.msg)
        localStorage.setItem("transactionToken",data.token);
        localStorage.setItem("transactionRole",JSON.stringify(data.data.role));
          navigate('/DashBoard');
       
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
    <div className="w-[100%] mt-[40px]  flex flex-col  mx-auto p-4">
    <h1 className='flex text-2xl justify-center item-center mb-5 font-bold'>Welcome To Order Transactions Services</h1>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto w-[70%] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
         className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
           className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />
      </div>
      <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-700"
          >
           Log In
          </button>
      <div className="flex items-center justify-between mt-[10px]">
        
        You have not Signed Up Yet? <span onClick={()=>navigate("/SignUp")} className='cursor-pointer hover:text-sky-300'>SignUp</span> 
      
      </div>
    </form>
    </div>
    </div>
  );
};

export default Login;
