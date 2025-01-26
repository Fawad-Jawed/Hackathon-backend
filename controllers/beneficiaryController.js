const Beneficiary = require('../models/Beneficiary');

const jwt = require('jsonwebtoken');

exports.addBeneficiary = async (req, res) => {
    const { cnic, name, phone, address, purpose } = req.body;

    try {
        // Check if the user already exists
        const existingBeneficiary = await Beneficiary.findOne({ cnic });

        if (existingBeneficiary) {
            // Fetch the last history entry to get previous action, remarks, and status
            const lastHistoryEntry = existingBeneficiary.history[existingBeneficiary.history.length - 1];

            const historyEntry = {
                department: purpose, // purpose indicates the department
                action: lastHistoryEntry ? lastHistoryEntry.action : 'Revisited', // Use previous action or 'Revisited' if first time
                remarks: lastHistoryEntry ? lastHistoryEntry.remarks : 'User revisited with a new purpose', // Use previous remarks or default
                status: lastHistoryEntry ? lastHistoryEntry.status : 'Pending', // Use previous status or 'Pending' if first time
                timestamp: new Date(), // Set the timestamp to current date
            };

            // Add the new history entry
            existingBeneficiary.history.push(historyEntry);

            // Save the updated beneficiary
            await existingBeneficiary.save();

            return res.status(200).json({
                message: 'User already exists. History updated.',
                token: existingBeneficiary._id.toString(), // Return token as ID
                user: existingBeneficiary,
            });
        }

        // Create a new user if first-time visit
        const beneficiary = new Beneficiary({
            cnic,
            name,
            phone,
            address,
            purpose,
            history: [], // Initialize empty history for new user
        });

        await beneficiary.save();

        return res.status(201).json({
            message: 'New user added successfully.',
            token: beneficiary._id.toString(), // Return token as ID
            user: beneficiary,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.getBeneficiary = async (req, res) => {
    const { token, department, action, remarks, status, solution } = req.body;

    try {
        // Find the beneficiary by token (Beneficiary ID)
        const beneficiary = await Beneficiary.findById(token);

        if (!beneficiary) {
            return res.status(404).json({ message: 'No user found for the provided token.' });
        }

        // Prepare the new history entry
        const historyEntry = {
            department: department || 'Unknown Department', // Use provided department or default
            action: action || 'Action Pending', // Use provided action or default
            remarks: remarks || 'No remarks provided', // Use provided remarks or default
            status: status || 'Pending', // Use provided status or default
            solution: solution || 'No solution provided', // Use provided solution or default
            timestamp: new Date(), // Add the current timestamp
        };

        // Push the new history entry into the beneficiary's history array
        beneficiary.history.push(historyEntry);

        // Save the updated beneficiary document
        await beneficiary.save();

        res.status(200).json({
            message: 'Beneficiary updated with new history entry.',
            user: beneficiary,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Edit Beneficiary
exports.editBeneficiary = async (req, res) => {
    const { token, cnic, name, phone, address, purpose, department, action, remarks, status, solution } = req.body;

    try {
        // Find the beneficiary by token (Beneficiary ID)
        const beneficiary = await Beneficiary.findById(token);

        if (!beneficiary) {
            return res.status(404).json({ message: 'No user found for the provided token.' });
        }

        // Update beneficiary details
        if (cnic) beneficiary.cnic = cnic;
        if (name) beneficiary.name = name;
        if (phone) beneficiary.phone = phone;
        if (address) beneficiary.address = address;
        if (purpose) beneficiary.purpose = purpose;

        // Prepare a new history entry
        const historyEntry = {
            department: department || 'Unknown Department',
            action: action || 'Action Pending',
            remarks: remarks || 'No remarks provided',
            status: status || 'Pending',
            solution: solution || 'No solution provided',
            timestamp: new Date(),
        };

        // Push the new history entry into the beneficiary's history
        beneficiary.history.push(historyEntry);

        // Save the updated beneficiary document
        await beneficiary.save();

        res.status(200).json({
            message: 'Beneficiary details updated with new history entry.',
            user: beneficiary,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete Beneficiary
exports.deleteBeneficiary = async (req, res) => {
    const { token } = req.body;

    try {
        // Find and delete the beneficiary by token (Beneficiary ID)
        const beneficiary = await Beneficiary.findByIdAndDelete(token);

        if (!beneficiary) {
            return res.status(404).json({ message: 'No user found for the provided token.' });
        }

        res.status(200).json({
            message: 'Beneficiary deleted successfully.',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
