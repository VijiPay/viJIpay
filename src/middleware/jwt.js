import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';
import db from '../models/index.js';
const { users: User } = db;

const { tokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof tokenExpiredError) {
        return res.status(401).send({message: 'Token Expired'})
    }
    return res.status(401).send({message: 'Not allowed!'})
} 

const verifyToken = (req, res, next) => { 
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
}

// check if user is admin
const isAdmin = async (req, res, next) => {
    console.log(req.body)
    try {
        const user = await User.findByPk(req.id);
console.log(user)

            if (user.roleId === 3) {
                next();
                return;
            }

        return res.status(403).json({ message: 'Require Admin Role' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// check if user is moderator
const isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.id);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'moderator') {
                next();
                return;
            }
        }
        return res.status(403).json({ message: 'Require Moderator Role' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

export const authJwt = {verifyToken, isAdmin, isModerator};