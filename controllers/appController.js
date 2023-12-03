const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require('../models/user.model');
const Trip = require('../models/trip.model');
const Expense = require('../models/expense.model');
const Transaction = require('../models/transactions.model');

async function registerUser(req, res) {
    const newPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const fromDB = await User.findOne({
            email: req.body.email.toLowerCase()
        })
        if (fromDB) return res.status(409).send({ error: 'Duplicate Email' })
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        return res.status(201).send({ email: user.email })
    } catch (err) {
        return res.status(500).send({ error: 'Some thing Went Wrong' })
    }
}

async function loginUser(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    user_id: user.id,
                    name: user.name,
                },
                'secret123'
            )
            return res.status(201).send({ user: token, user_name: user.name, user_id: user.id })
        } else {
            return res.status(401).send({ error: 'Invalid Password' })
        }
    } catch (err) {
        return res.status(500).send({ error: 'Some thing Went Wrong' })
    }
}



module.exports = {
    registerUser,
    loginUser,
}