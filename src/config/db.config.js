import dotenv from 'dotenv';
dotenv.config();

const config = {
    HOST: process.env.HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,  
    DB: process.env.DB,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
};

export default config;