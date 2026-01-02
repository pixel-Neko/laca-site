const express = require("express");
const route = express.Router();
const Form = require("../models/form");
const Subject = require("../models/subject");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

route.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    console.log('You enetred the route gigg');
    try {
        if( !token ) {
            return res.render('verify-email', { 
                success: false,
                message: "Invalid response" 
            });
        };
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const existingUser = await Form.findOne({ email: decoded.email });
        if( existingUser ) {
            return res.render('verify-email', {
                success: false,
                message: `Seat for this email is already reserved`,
            });
        };
        console.log(`New user: ${decoded.email}`);
        const newReg = new Form({
            name: decoded.name,
            email: decoded.email,
            rollNumber: decoded.rollNumber,
            mobileNum: decoded.mobileNum,
            gender: decoded.gender,
            branch: decoded.branch,
            subjectCode: decoded.subjectCode,
        });

        await newReg.save();

        const avSub = await Subject.findOne({ subjectCode: decoded.subjectCode });
        console.log(`Max seats for this: ${avSub.maxSeats}`);

        const sub = await Subject.findOneAndUpdate(
            { code: decoded.subjectCode, seatsFilled: { $lt: avSub.maxSeats } },
            { $inc: { seatsFilled: 1 } },
            { new: true },
        );
        console.log(`Updated seats: ${sub.seatsFilled}`);
        if( !sub ) {
            return req.render('verify-email', {
                success: false,
                message: `Seats for this subject just got filled up!` 
            });
        }
        console.log(`Seat reserved for ${decoded.email}`);
        return res.render('verify-email', {
            success: true,
            message: `Your seat has been reserved: ${decoded.subjectCode}`,
        });
    } catch(error) {
        await Subject.findOneAndUpdate(
            { code: decoded.subjectCode, seatsFilled: { $lt: avSub.maxSeats } },
            { $inc: { seatsFilled: -1 } },
            { new: true },
        );
        console.log(`Error: ${error}`);
        return res.render('verify-email', {
            success: false,
            message: `Try again gigga`,
        })
    }
});

module.exports = route;

