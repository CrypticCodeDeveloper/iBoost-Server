const ServiceOrder = require('../models/orderedServices');
const Wallet = require('../models/walletModel');

//

const getAllServiceOrders = async (req, res) => {
    const allOrderedServices = await ServiceOrder.find({}).sort({createdAt: -1});
    const completedServices = await ServiceOrder.find({ status: 'approved' })
    const rejectedServices = await ServiceOrder.find({ status: 'rejected' })
    const pendingServices = await ServiceOrder.find({ status: 'pending' })

    res.status(200).json({
        message: 'All service ordered',
        data: {
            allOrderedServices,
            stats:{
                total: allOrderedServices.length,
                completed: completedServices.length,
                pending: pendingServices.length,
                rejected: rejectedServices.length,
            }
        }
    })
}

const createNewServiceOrder = async (req, res) => {
    const {platform, service, quantity, socialLink, totalAmount} = req.body;
    const user = req.user;

    if (!platform || !service || !quantity || !socialLink) {
        return res.status(400).json({message: 'All fields are required'});
    }

    const newServiceOrder = new ServiceOrder({
        userId: user.id,
        platform,
        service,
        quantity,
        socialLink,
        totalAmount
    });

    // Deduct the quantity from the user's wallet
    const wallet = await Wallet.findOne({ userId: user.id });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < newServiceOrder.totalAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    const savedServiceOrder = await newServiceOrder.save();


    wallet.balance -= savedServiceOrder.totalAmount;
    wallet.transactions.push({ type: 'debit', amount: savedServiceOrder.totalAmount, description: `Deducted ${savedServiceOrder.totalAmount} for 
    ${savedServiceOrder.quantity} ${savedServiceOrder.platform} ${savedServiceOrder.service}` });
    await wallet.save();

    res.status(201).json({message: 'Service order created successfully', newServiceOrder});
};



// Function to update the status of a service order

const updateServiceStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderedService = await ServiceOrder.findById(id)

    if (!orderedService) {
        return res.status(404).json({ message: 'Service order not found' });
    }

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    if (status === "rejected") {

        const wallet = await Wallet.findOne({userId: orderedService.userId})

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for refund' });
        }


        wallet.balance += orderedService.totalAmount;
        wallet.transactions.push({ type: 'credit', amount: orderedService.totalAmount, description: `Refunded ${orderedService.totalAmount} for failed service processing.` });
        await wallet.save();
    }

   const updatedService = await ServiceOrder.findByIdAndUpdate(id, {status}, { new: true });
    res.status(200).json({ message: 'Service order status updated successfully', updatedService });
}

const getPendingOrders = async (req, res) => {
    const pendingOrders = await ServiceOrder.find({ status: 'pending' }).sort({createdAt: -1})
        .populate('userId', 'username email')

    res.status(200).json({
        message: 'Pending orders retrieved successfully',
        data: {
            pendingOrders
        }
    })
}

const getOrderTotals = async (req, res) => {
    try {
        const approvedOrders = await ServiceOrder.find({ status: 'approved' });
        const pendingOrders = await ServiceOrder.find({ status: 'pending' });

        const approvedTotal = approvedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingTotal = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.status(200).json({
            message: 'Order totals retrieved successfully',
            data: {
                approvedTotal,
                pendingTotal
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order totals', error: error.message });
    }
};

module.exports = {
    createNewServiceOrder,
    updateServiceStatus,
    getPendingOrders,
    getAllServiceOrders,
    getOrderTotals
}
