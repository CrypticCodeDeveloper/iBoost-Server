const User = require('../models/userModel')
const Wallet = require('../models/walletModel');
const OrderedServices = require('../models/orderedServices')

const getAllUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
}

const getUserById = async (req, res) => {
    const {id} = req.params
    const existingUser = await User.findById(id)
    if (!existingUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    // Respond with user
    res.status(200).json({
        status: 'success',
        data: {
            user: existingUser
        }
    })

};

const getUserWallet = async (req, res) => {
    const {id} = req.params
    const existingUser = await User.findById(id)
    if (!existingUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const wallet = await Wallet.findOne({userId: existingUser.id})
    if (!wallet) {
        return res.status(404).json({
            message: 'Wallet not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            wallet
        }
    })
}

getUserTransactions = async (req, res) => {
    const {id} = req.params
    const existingUser = await User.findById(id)
    if (!existingUser) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const userTransactions = await OrderedServices.find({ userId: existingUser.id })
        .sort({ createdAt: -1 });
    if (!userTransactions) {
        return res.status(404).json({
            message: 'No transactions found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            transactions: userTransactions
        }
    })
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserWallet,
    getUserTransactions
};