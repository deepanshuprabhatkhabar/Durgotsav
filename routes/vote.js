const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const ExcelJS = require('exceljs');

const isAdmin = require('../middleware/isAdmin');


// Get stats (criteria and pandal counts)
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const allVotes = await Vote.find();


        // Get criteria stats
        const criteriaStats = {};
        allVotes.forEach(vote => {
            criteriaStats[vote.criteria] = (criteriaStats[vote.criteria] || 0) + 1;
        });

        const criteriaList = Object.entries(criteriaStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);


        // Get pandal stats
        const pandalStats = {};
        allVotes.forEach(vote => {
            pandalStats[vote.pandalName] = (pandalStats[vote.pandalName] || 0) + 1;
        });

        const pandalList = Object.entries(pandalStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Get name and criteria stats
        const nameAndCriteriaStats = {};
        allVotes.forEach(vote => {
            const key = `${vote.name}|${vote.criteria}`;
            nameAndCriteriaStats[key] = (nameAndCriteriaStats[key] || 0) + 1;
        });

        const nameAndCriteriaList = Object.entries(nameAndCriteriaStats)
            .map(([key, count]) => {
                const [name, criteria] = key.split('|');
                return { name, criteria, count };
            })
            .sort((a, b) => b.count - a.count);

        res.json({
            criteria: criteriaList,
            pandals: pandalList,
            nameAndCriteria: nameAndCriteriaList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate Excel for votes
router.get('/excel', isAdmin, async (req, res) => {
    try {
        const { startDate, endDate, name, mobileNumber, criteria, pandalName } = req.query;
        let query = {};

        // Check if any filter is applied
        const isFilterApplied = startDate || endDate || name || mobileNumber || criteria || pandalName;

        if (isFilterApplied) {
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Set end date to end of day
                query.createdAt = {
                    $gte: start,
                    $lte: end
                };
            }

            if (name) query.name = { $regex: name, $options: 'i' };
            if (mobileNumber) query.mobileNumber = { $regex: mobileNumber, $options: 'i' };
            if (criteria) query.criteria = { $regex: criteria, $options: 'i' };
            if (pandalName) query.pandalName = { $regex: pandalName, $options: 'i' };
        }

        const votes = await Vote.find(query).sort({ createdAt: 'desc' });

        if (votes.length === 0) {
            return res.status(404).json({ message: 'No votes found for the given criteria' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Votes');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
            { header: 'Criteria', key: 'criteria', width: 15 },
            { header: 'Pandal Name', key: 'pandalName', width: 20 },
            { header: 'Timestamp', key: 'createdAt', width: 20 }
        ];

        votes.forEach(vote => {
            worksheet.addRow({
                name: vote.name,
                mobileNumber: vote.mobileNumber,
                criteria: vote.criteria,
                pandalName: vote.pandalName,
                createdAt: vote.createdAt.toLocaleString()
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=votes.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    }
});

// Get all votes
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        // Add filters
        const { name, mobileNumber, criteria, pandalName, startDate, endDate } = req.query;
        let filter = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (mobileNumber) filter.mobileNumber = { $regex: mobileNumber, $options: 'i' };
        if (criteria) filter.criteria = { $regex: criteria, $options: 'i' };
        if (pandalName) filter.pandalName = { $regex: pandalName, $options: 'i' };
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Set end date to end of day
            filter.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const totalVotes = await Vote.countDocuments(filter);
        const votes = await Vote.find(filter).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalVotes / limit),
            totalItems: totalVotes,
            itemsPerPage: limit
        };

        let pieChartData;
        if (criteria) {
            // If criteria is specified, show percentage of votes by pandalName
            pieChartData = await Vote.aggregate([
                { $match: filter },
                { $group: { _id: "$pandalName", count: { $sum: 1 } } },
                { $project: {
                    name: "$_id",
                    percentage: { $multiply: [{ $divide: ["$count", totalVotes] }, 100] },
                    _id: 0
                }},
                { $sort: { percentage: -1 } }
            ]);
        } else if (pandalName) {
            // If pandalName is specified, show percentage of votes by criteria
            pieChartData = await Vote.aggregate([
                { $match: filter },
                { $group: { _id: "$criteria", count: { $sum: 1 } } },
                { $project: {
                    name: "$_id",
                    percentage: { $multiply: [{ $divide: ["$count", totalVotes] }, 100] },
                    _id: 0
                }},
                { $sort: { percentage: -1 } }
            ]);
        } else {
            // If neither criteria nor pandalName is specified, show both
            const votesByCriteria = await Vote.aggregate([
                { $match: filter },
                { $group: { _id: "$criteria", count: { $sum: 1 } } },
                { $project: {
                    name: "$_id",
                    percentage: { $multiply: [{ $divide: ["$count", totalVotes] }, 100] },
                    _id: 0
                }},
                { $sort: { percentage: -1 } }
            ]);

            const votesByPandal = await Vote.aggregate([
                { $match: filter },
                { $group: { _id: "$pandalName", count: { $sum: 1 } } },
                { $project: {
                    name: "$_id",
                    percentage: { $multiply: [{ $divide: ["$count", totalVotes] }, 100] },
                    _id: 0
                }},
                { $sort: { percentage: -1 } }
            ]);

            pieChartData = {
                byCriteria: votesByCriteria,
                byPandal: votesByPandal
            };
        }

        // Get all unique criteria
        const allCriteria = await Vote.distinct('criteria');

        // Get all unique pandalNames
        const allPandalNames = await Vote.distinct('pandalName');

        res.json({
            pagination,
            votes,
            pieChartData,
            allCriteria,
            allPandalNames
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific vote
router.get('/:id', async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).json({ message: 'Vote not found' });
        res.json(vote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a vote (admin only)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updatedVote = await Vote.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVote) return res.status(404).json({ message: 'Vote not found' });
        res.json(updatedVote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a vote (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedVote = await Vote.findByIdAndDelete(req.params.id);
        if (!deletedVote) return res.status(404).json({ message: 'Vote not found' });
        res.json({ message: 'Vote deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new vote
router.post('/', async (req, res) => {
    try {
        const { name, mobileNumber, criteria, pandalName } = req.body;

        // Check if all required fields are present
        if (!name || !mobileNumber || !criteria || !pandalName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new vote
        const newVote = new Vote({
            name,
            mobileNumber,
            criteria,
            pandalName
        });

        // Save the vote to the database
        const savedVote = await newVote.save();

        res.status(201).json(savedVote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});




module.exports = router;
