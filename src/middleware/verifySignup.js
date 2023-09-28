//middleware to verify the user's role and sign up and check for duplicate email
import db from "../models/index.js";

const { ROLES, users:User } = db;

// check for duplicate email
 const checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// check if role exists
 const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({ message: `Role ${req.body.roles[i]} does not exist` });
            }
        }
    }
    next();
}

export const verifySignUp = {
    checkDuplicateEmail, checkRolesExisted
};