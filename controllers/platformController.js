const Platform = require('../models/platformsModel');

const getAllPlatforms = async (req, res) => {
    const platforms = await Platform.find({}).sort({createdAt: -1});
    res.status(200).json({
        message: 'all platforms',
        data: {
            platforms
        }
    })
}

const getPlatform = async (req, res) => {
    const {id} = req.params;
    const platform = await Platform.findById(id)

    if (!platform) {
        return res.status(404).json({
            message: 'No platform found'
        })
    }

    res.status(200).json({
        message: 'platform retrieved successfully',
        data: {
            platform
        }
    })
}

const createPlatform = async (req, res) => {
    const {name, services, price} = req.body;
    if (!name || !services || !price) {
        return res.status(400).json({message: 'All fields are required'});
    }

    const newPlatform = new Platform({
        name,
        services,
        price
    })

    await newPlatform.save()
    res.status(201).json({
        message: `${name} added to platforms`,
        platform: newPlatform
    })
}

const deletePlatform = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({message: 'Platform ID is required'});
    }

    const platform = await Platform.findByIdAndDelete(id);
    if (!platform) {
        return res.status(404).json({message: 'Platform not found'});
    }

    res.status(200).json({
        message: `${platform.name} deleted from platforms`,
        platform
    })
}

const editPlatform = async (req, res) => {
    const { id } = req.params;
    const { name, services, price } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Platform ID is required' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (services) updatedFields.services = services;
    if (price) updatedFields.price = price;

    const platform = await Platform.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!platform) {
        return res.status(404).json({ message: 'Platform not found' });
    }

    res.status(200).json({
        message: `${platform.name} updated successfully`,
        platform
    });
};

module.exports = {
    getAllPlatforms,
    createPlatform,
    deletePlatform,
    editPlatform,
    getPlatform
}
