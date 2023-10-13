const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: "./config.env" });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = process.env.DOMAIN_NAME;

app.post("/api/v1/create-checkout-session", async (req, res, next) => {
  try {
    // Get Product from req-body
    const products = req.body;

    // Check if no products
    if (!products) {
      return res.status(400).json("Something went wrong!");
    }

    // Create line-items
    const lineItems = products?.map((product) => {
      return {
        price_data: {
          currency: 'inr',
          unit_amount: product.price * 10000,
          product_data: {
            name: `${product.title}`,
            description: product.description,
            images: [`${product.thumbnail}`],
          },
        },
        quantity: product.quantity
      };
    });

    // Create a payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    // Send back a response to user
    res.status(201).json({
      status: "success",
      data: {
        session
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: {
        error
      }
    });
  }
});

module.exports = app;

