import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { ErrorToast, SuccessToast } from "./Popup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TransactionForm = () => {
  const navigate = useNavigate();
  const url = "https://orderstockexchangebackend.onrender.com";
  const token = localStorage.getItem("transactionToken");
  const [transactionType, setTransactionType] = useState("");
  const [buyerQty, setBuyerQty] = useState("");
  const [buyerPrice, setBuyerPrice] = useState("");
  const [sellerPrice, setSellerPrice] = useState("");
  const [sellerQty, setSellerQty] = useState("");

  useEffect(() => {
    if (!token) {
      ErrorToast("Please logged in");
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [token]);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const payload = {
        buyerQty,
        buyerPrice,
        sellerPrice,
        sellerQty,
        type: transactionType,
      };
      const { data } = await axios.post(`${url}/api/v1/transactions`, payload, {
        headers: {
          authorization: token,
        },
      });
      if (data.success) {
        SuccessToast(data.msg);
        navigate("/DashBoard");
      } else {
        console.log("error", data);
        ErrorToast(data?.msg);
      }
    } catch (err) {
      console.log("err", err);
      ErrorToast(err.response.data.msg);
    }
  };

  return (
    <div className="container mx-auto p-6">
     <div className="text-2xl w-[80%] mx-auto font-bold mb-7   flex items-center justify-between">
    <Typography variant="h4"  gutterBottom>
        Transactions Form Pannel
      </Typography>
      <button
            onClick={()=>navigate("/DashBoard")}
            type="submit"
            className="w-[20%] px-4 py-2 font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-700"
          >
           DashBoard
          </button>
    </div>
      <form className="space-y-4 w-[50%] m-auto" onSubmit={handleSubmit}>
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Transaction Type</InputLabel>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            label="Transaction Type"
          >
            <MenuItem value="buyer">Buy</MenuItem>
            <MenuItem value="seller">Sell</MenuItem>
          </Select>
        </FormControl>

        {transactionType === "buyer" && (
          <>
            <TextField
              label="Buyer Quantity"
              fullWidth
              variant="outlined"
              value={buyerQty}
              onChange={(e) => setBuyerQty(e.target.value)}
              required
            />
            <TextField
              label="Buyer Price"
              fullWidth
              variant="outlined"
              value={buyerPrice}
              onChange={(e) => setBuyerPrice(e.target.value)}
              required
            />
          </>
        )}

        {transactionType === "seller" && (
          <>
            <TextField
              label="Seller Price"
              fullWidth
              variant="outlined"
              value={sellerPrice}
              onChange={(e) => setSellerPrice(e.target.value)}
              required
            />
            <TextField
              label="Seller Quantity"
              fullWidth
              variant="outlined"
              value={sellerQty}
              onChange={(e) => setSellerQty(e.target.value)}
              required
            />
          </>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Order
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
