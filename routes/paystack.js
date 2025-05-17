const express = require('express');
const https = require('https');
const router = express.Router();
const {addFunds} = require('../controllers/walletController')
const VerifiedTransaction = require('../models/verifiedTransactions')

router.get('/', (req, res) => {
    const { amount, email } = req.query;
    if (!amount || !email) {
        return res.status(400).json({ error: 'Amount and email are required' });
    }
    const params = JSON.stringify({
        "email": email,
        "amount": Number(amount) * 100,
        "callback_url": "http://localhost:5173/payment/callback"
    });

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Use environment variable
            'Content-Type': 'application/json'
        }
    };

    const paystackReq = https.request(options, paystackRes => {
        let data = '';

        paystackRes.on('data', (chunk) => {
            data += chunk;
        });

        paystackRes.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                res.status(paystackRes.statusCode).json(parsedData); // Send response to client
            } catch (error) {
                res.status(500).json({ error: 'Error parsing response from Paystack' });
            }
        });
    }).on('error', error => {
        console.error(error);
        res.status(500).json({ error: 'Error connecting to Paystack' });
    });

    paystackReq.write(params);
    paystackReq.end();
});

router.get('/verify', async (req, res) => {
    const { reference, userId } = req.query;

    if (!reference) {
        return res.status(400).json({ error: 'Reference is required' });
    }

    // Check if the transaction has already been verified
    const isTransVerified = await VerifiedTransaction.findOne({ referenceString: reference });
    if (isTransVerified) {
        return res.status(400).json({ error: 'Transaction already verified' });
    }

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Use environment variable
        }
    };

    const paystackReq = https.request(options, paystackRes => {
        let data = '';

        paystackRes.on('data', (chunk) => {
            data += chunk;
        });

        paystackRes.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                if(parsedData.status) {
                    const mockReq = {
                        body: {
                            userId: userId,
                            amount: parsedData.data.amount / 100,
                            reference
                        }
                    }
                    addFunds(mockReq, res);
                }

            } catch (error) {
                res.status(500).json({ error: 'Error parsing response from Paystack' });
            }
        });
    }).on('error', error => {
        console.error(error);
        res.status(500).json({ error: 'Error connecting to Paystack' });
    });

    paystackReq.end();
});

module.exports = router;
