import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/models/index.js';
import router from './src/routes/index.routes.js';

dotenv.config();


const Role = db.roles;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['https://vijipay.ng', 'http://localhost:4200'],
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use('*', cors(corsOptions));
db.sequelize.sync({force: true})
    .then(() => {
      console.log('Resync Db');
        initial();
    })
    .catch(err => console.log('Failed to Connect: '+ err.message));

    async function initial() {
      const rolesToCreate = [
        { id: 1, name: "user" },
        { id: 2, name: "moderator" },
        { id: 3, name: "admin" }
      ];
    
      for (const roleData of rolesToCreate) {
        const existingRole = await Role.findByPk(roleData.id);
        if (!existingRole) {
          await Role.create(roleData);
        }
      }
    }
    
      
app.use(router);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
