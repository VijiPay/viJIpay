import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';

const {users: User, roles: Role} = db;

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

        const passwordIsValid = bcrypt.compare(password, user.password_hash);

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


export const createRole = (req, res) => {
    const role = req.body;

    Role.create({
      id: 1,
      name: role[0]
    });
   
    Role.create({
      id: 2,
      name: role[1]
    });
   
    Role.create({
      id: 3,
      name: role[2]
    });
    res.send({ message: "Roles were created successfully!" });
}