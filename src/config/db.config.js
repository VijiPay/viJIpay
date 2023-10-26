import dotenv from 'dotenv';
dotenv.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID} = process.env;

const config = {
    HOST: PGHOST,
    DB_USER: PGUSER,
    DB_PASSWORD: PGPASSWORD,  
    DB: PGDATABASE,
    dialect: "postgres",
    ssl: 'require',
    ENDPOINT_ID: ENDPOINT_ID,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
};

export default config;
