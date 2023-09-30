import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';
import crypto from 'crypto';

const {users: User, roles: Role} = db;
//generate token
const generateToken = (length) => {
    const token = crypto.randomBytes(length).toString('hex');
    return token;
}

//user signup
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, address } = req.body;
        const role = await Role.findOne({
            where: {
                name: 'user'
            }
        });

        const user = await User.create({
            first_name:firstName,
            last_name:lastName,
            email,
            password_hash: bcrypt.hashSync(password, 8),
            phone:phoneNumber,
            address,
            roleId: role.dataValues.id
        });
        
         // Generate email verification token and expiration date
         const verificationToken = generateToken(20);
         user.verificationToken = verificationToken;
         user.verificationTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours
         await user.save();

        //send email

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}


//user signin
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
        console.log(passwordIsValid)
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: 'Invalid Password'
            });
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        });

        const role = await Role.findByPk(user.roleId);

        const authority = role.name;

        const { user_id, first_name, last_name, email:user_email, phone:phone_number, address } = user.dataValues;

        return res.status(200).json({
            user_id,
            first_name,
            last_name,
            user_email,
            phone_number,
            address,
            role: authority,
            accessToken: token
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//forgot password
export const forgotPassword = async (req, res) => {
   try {
    const { email } = req.body;

    const user = await User.findOne({
        where: {
            email
        }
    });
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = generateToken(32);
    user.resetPasswordToken = resetToken;

    user.save();

    //send email
    
    return res.status(200).json({ message: 'Reset password link sent to your email', object:user.resetPasswordToken });
   } catch (error) {
       console.error(error.message);
       return res.status(500).json({ message: 'Server Error' });
   }
}

//verify email
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            where: {
                verificationToken: token
            }
        });
        if(!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }
        user.verificationToken = null;
        user.verificationTokenExpiration = null;
        user.email_verified = true;
        await user.save();
        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//send verification email
export const sendVerificationEmail = async (email, res) => {
    const verificationToken = generateToken(20);
    const verificationTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

    const user = await User.findOne({
        where: {
            email
        }
    });
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.verificationToken = verificationToken;
    user.verificationTokenExpiration = verificationTokenExpiration;
    user.save();

    //send email with verification token (verificationToken)

    return res.status(200).json({ message: 'Verification email sent' });
}

//verify reset token
export const verifyResetToken = async (req, res) => {
    try {
        const { resetToken } = req.body;

        const user = await User.findOne({
            where: {
                resetPasswordToken: resetToken
            }
        });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Reset token verified' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, password, resetToken } = req.body;

        const user = await User.findOne({
            where: {
                email
            }
        });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(resetToken !== user.resetPasswordToken) {
            return res.status(401).json({ message: 'Invalid reset token' });
        }
        const password_hash = bcrypt.hashSync(password, 8);
        user.password_hash = password_hash;
        user.resetPasswordToken = null;
        user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//suspend or delete user
export const suspendUser = async (req, res) => {
    try {
        const { id } = req.params;
        setStatus = req.body.status;
        const user = await User.findByPk(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = setStatus;
        user.save();
        return res.status(200).json({ message: 'User suspended' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}
