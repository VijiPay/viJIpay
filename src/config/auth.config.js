import dotenv from 'dotenv';
dotenv.config();

const authConfig = {
    secret: process.env.SECRET,
};

export default authConfig;