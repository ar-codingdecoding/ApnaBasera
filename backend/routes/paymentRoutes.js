import express from "express";
import crypto from "crypto";
import { razorpay } from "../server.js";

const router = express.Router();

// Create Razorpay Payment Order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount: amount * 100, 
      currency,
      receipt: receipt || `receipt_order_${new Date().getTime()}`,
      notes: {
        created_at: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID, 
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({ error: "Error creating payment order" });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: "Missing required payment verification parameters",
      });
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});

// Get Payment Details
router.get("/details/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({ error: "Error fetching payment details" });
  }
});

// Refund Payment
router.post("/refund", async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const refundOptions = {
      payment_id,
      ...(amount && { amount: amount * 100 }), 
      notes: {
        reason: reason || "Refund requested by customer",
        refund_date: new Date().toISOString(),
      },
    };

    const refund = await razorpay.payments.refund(payment_id, refundOptions);

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ error: "Error processing refund" });
  }
});

// Get All Orders (for admin)
router.get("/orders", async (req, res) => {
  try {
    const { count = 10, skip = 0 } = req.query;

    const orders = await razorpay.orders.all({
      count: parseInt(count),
      skip: parseInt(skip),
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

export default router;
