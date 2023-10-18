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
    const { name, email, password, phone, isSeller } = req.body;
    const names = name.split(' ');

const firstName = names.slice(0, -1).join(' ');
const lastName = names[names.length - 1];
    try {

        const role = await Role.findOne({
            where: {
                name: 'user'
            }
        });
        console.log('role', role)

        const user = await User.create({
            first_name:firstName,
            last_name:lastName,
            email: email,
            password_hash: bcrypt.hashSync(password, 8),
            phone:phone,
            roleId: role.id,
            isSeller: isSeller
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
        if (!passwordIsValid) {
            return res.status(401).json({
                message: 'Invalid Password'
            });
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        });

        const role = await Role.findByPk(user.roleId);
        const authority = role.name;

        const response = {
            id: user.id,
            firstName: user.first_name,
            phone: user.phone,
            isSeller: user.isSeller,
            role: authority,
            accessToken: token,
            refreshToken: ''
        }

        return res.status(200).json(response);
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

//delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//get User
export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).send({user: user})
        }
    } catch (error) {
        res.status(500).send({message: 'user not found'})
    }
}

// update user
export const update = async (req, res) => {
    const  data  = req.body;
console.log(data)
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateduser = await user.update(data);
        return res.status(200).json({ user: updateduser, message: 'User Updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}