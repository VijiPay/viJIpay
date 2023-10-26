import dotenv from 'dotenv';
dotenv.config();

const authConfig = {
    secret: process.env.SECRET,
    jwtExpiration: process.env.TEST_EXP,
    jwtRefreshExpiration: process.env.TEST_REFRESH
};

export default authConfig;