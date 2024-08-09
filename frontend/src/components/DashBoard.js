import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { ErrorToast } from './Popup';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DashBoard = () => {
  const url="https://orderstockexchangebackend.onrender.com";
  const navigate = useNavigate();
  const token = localStorage.getItem("transactionToken");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      ErrorToast("Please logged in");
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const pendingResponse = await axios.get(`${url}/api/v1/Pending-Transactions`,{
        headers: {
          authorization: token,
        },
      });
      const completedResponse = await axios.get(`${url}/api/v1/completed-Transactions`,{
        headers: {
          authorization: token,
        },
      });
    
      setPendingOrders(pendingResponse.data.data);
      setCompletedOrders(completedResponse.data.data);
      setLoading(false);
    } catch (error) {
      if(error.response.status){
        setCompletedOrders([]);
        setPendingOrders([]);
      };
    }
   
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size={60} thickness={5} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
    <div className="text-2xl w-[80%] mx-auto font-bold mb-7   flex items-center justify-between">
    <Typography variant="h4"  gutterBottom>
        Pending and Completed Orders
      </Typography>
      <button
            onClick={()=>navigate("/transactions-form")}
            type="submit"
            className="w-[20%] px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-700"
          >
           Transaction Form
          </button>
    </div>
      

      {/* Pending Orders */}
      <div className="w-[80%] mx-auto">
      <Typography variant="h5" className="mt-8 mb-4">
        Pending Orders
      </Typography>
      <Paper className="overflow-hidden mb-8">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buyer Qty</TableCell>
              <TableCell>Buyer Name</TableCell>
              <TableCell>Buyer Price</TableCell>
              <TableCell>Seller Price</TableCell>
              <TableCell>Seller Name</TableCell>
              <TableCell>Seller Qty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingOrders?.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.buyerQty}</TableCell>
                <TableCell>{order?.buyer?.username}</TableCell>
                <TableCell>{order.buyerPrice}</TableCell>
                <TableCell>{order.sellerPrice}</TableCell>
                <TableCell>{order?.seller?.username}</TableCell>
                <TableCell>{order.sellerQty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Completed Orders */}
      <Typography variant="h5" className="mt-8 mb-4">
        Completed Orders
      </Typography>
      <Paper className="overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buyer Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completedOrders?.map((order, index) => (
              <TableRow key={index}>
               <TableCell>{order.buyer.username}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      </div>
     
    </div>
  );
};

export default DashBoard;
























// // src/components/DashBoard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ErrorToast, SuccessToast } from './Popup';

// const DashBoard = () => {
//   const url="https://banking-system-backend-eoo1.onrender.com"
//   const navigate = useNavigate();
//   const token = localStorage.getItem("BankToken");
//   const role = JSON.parse(localStorage.getItem("BankRole"));
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState();
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {

//     if (!token || role!="banker" ) {
//       ErrorToast("You are not banker to authorised this route")
//       navigate("/");
//     }else{
//       const fetchCustomers = async () => {
//         try {
//           const {data} = await axios.get(`${url}/api/auth/AllUser`, {
//             headers: { Authorization: token },
//           });
//           setCustomers(data.data);
//         } catch (error) {
          
//         }
       
//       };
//       fetchCustomers();
//     }
   
   
//   }, [token]);

//   const handleCustomerClick = async (customerId) => {
//     try {
//       const {data} = await axios.get(`${url}/api/transaction/${customerId}`, {
//         headers: { Authorization: token },
//       });
//       if(data.success){
//         SuccessToast(data.msg);
//         setSelectedCustomer(data.data);
//         setTransactions(data.data.transactions);
//       }else{
//         setSelectedCustomer({});
//         setTransactions([]);
//         ErrorToast(data.msg);

//       }
   
//     } catch (error) {
//       console.log("error",error);
//       setSelectedCustomer({});
//       setTransactions([]);
//       ErrorToast(error.response.data.msg)
//     }
  
//   };

//   return (
//     <div className="container mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-7 border-b-[2px] border-b-blue-400 flex items-center justify-center">Customer Transactions Details Pannel</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           <h1 className="text-2xl font-bold mb-4">All Customers</h1>
//           <ul className="space-y-2">
//             {customers?.map((customer) => (
//               <li
//                 key={customer?._id}
//                 className="cursor-pointer border-b py-2"
//                 onClick={() => handleCustomerClick(customer?._id)}
//               >
//                 {customer?.username} - {customer?.email}
//               </li>
//             ))}
//           </ul>
//         </div>
//         {selectedCustomer && (
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <h1 className="text-2xl font-bold mb-4">Transactions of {selectedCustomer?.userId?.username}</h1>
//             <ul className="space-y-4">
//       {transactions.map((transaction) => (
//         <li key={transaction?._id} className="border-b py-4 flex justify-between items-center">
//           <div>
//             <span className={`font-semibold ${transaction?.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
//               {transaction?.type.charAt(0).toUpperCase() + transaction?.type.slice(1)}
//             </span>{' '}
//             - <span className="font-medium text-gray-700">${transaction?.amount}</span>
//           </div>
//           <div className="text-sm text-gray-500">
//             {new Date(transaction?.date).toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             })}
//           </div>
//         </li>
//       ))}
//     </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashBoard;

