import dotenv from 'dotenv';
dotenv.config();

const authConfig = {
    secret: process.env.SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION
};

export default authConfig;