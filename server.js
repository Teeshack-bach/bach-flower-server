// Backend: Stripe Checkout Session for Bach Flower Remedy Chooser
// Node.js with Express.js
require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { remedies } = req.body;

        if (!remedies || remedies.length === 0) {
            return res.status(400).json({ error: "No remedies selected." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Custom Bach Flower Remedy Blend (${remedies.length} Remedies)`
                        },
                        unit_amount: 2999, // Price in cents (e.g., $29.99)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://yourwebsite.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://yourwebsite.com/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: 'Failed to create Stripe checkout session.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
    res.send('Server is running!');
});
