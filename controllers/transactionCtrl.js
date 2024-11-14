const transactionModel = require("../models/transactionModel");
const moment = require("moment");

// Get all transactions
const getAllTransaction = async (req, res) => {
    try {
        
        const { frequency, type } = req.query;

        
        let dateFilter = {};
        if (frequency && frequency !== 'custom') {
            dateFilter = {
                date: {
                    $gte: moment().subtract(Number(frequency), 'days').toDate(),
                },
            };
        }
        else if (frequency === 'custom' && startDate && endDate) {
            const startMoment = moment(startDate, 'YYYY-MM-DD', true); // Validate format
            const endMoment = moment(endDate, 'YYYY-MM-DD', true);
            if (!startMoment.isValid() || !endMoment.isValid()) {
                return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
            }

            // Handle custom date filter (if startDate and endDate are valid)
            dateFilter.date = {
                $gte: startMoment.toDate(), // Start date
                $lte: endMoment.toDate(),   // End date
            };
        }

        
        const queryFilter = {
            ...dateFilter,
            ...(type && type !== 'all' ? { type } : {}), // Only add the type filter if it's not 'all'
        };
        const transactions = await transactionModel.find(queryFilter).sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
};


// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transactionModel.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).send("Transaction Deleted!");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Failed to delete transaction', error });
    }
};

// Edit a transaction
const editTransaction = async (req, res) => {
    try {
        console.log("Incoming request params ID:", req.params.id);
        console.log("Incoming request body:", req.body);

        const { id } = req.params;
        const updateData = req.body;

        const transaction = await transactionModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction Updated!', transaction });
    } catch (error) {
        console.error("Error occurred while updating transaction:", error.message);
        res.status(500).json({ message: 'Failed to update transaction', error: error.message });
    }
};


const addTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date, refrence } = req.body;

        // Validate required fields
        if (!amount || !type || !category || !description || !date) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newTransaction = new transactionModel({
            amount,
            type,
            category,
            description,
            date,
            refrence // Optional field
        });

        await newTransaction.save();
        res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Failed to add transaction', error });
    }
};
module.exports = {
    getAllTransaction,
    deleteTransaction,
    editTransaction,
    addTransaction
};
