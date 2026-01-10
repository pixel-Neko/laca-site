const express = require("express");
const route = express.Router();
const Subject = require("../models/subject");

const subjectCode = ['SA-201', 'SA-202', 'SA-203', 'SA-204', 'SA-205', 'SA-206', 'SA-207', 'SA-208', 'SA-209', 'SA-210', 'SA-211', 'SA-212', 'SA-213'];

route.get('/', (req, res) => {
    res.render('subject', { subjectCodes: subjectCode });
});

// API endpoint to fetch all subjects
route.get('/api/all', async (req, res) => {
    try {
        const subjects = await Subject.find({});
        const formattedSubjects = subjects.map(sub => ({
            code: sub.code,
            name: sub.name || sub.code,
            maxSeats: sub.maxSeats,
            seatsFilled: sub.seatsFilled || 0,
        }));
        return res.status(200).json({
            success: true,
            data: formattedSubjects,
        });
    } catch (err) {
        console.error('Error fetching subjects:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subjects',
        });
    }
});

route.post('/', async (req, res) => {
    const { code, maxSeats } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });
    const sub = new Subject({
        code,
        maxSeats,
    });
    await sub.save();
    return res.status(200).json({ message: "Subject added to the database" });
})

module.exports = route;
