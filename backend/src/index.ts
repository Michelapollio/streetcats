import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js'
import sequelize from './config/database.js';
import catRoutes from './routes/catRoutes.js' 
import { fileURLToPath } from 'url'; 

// ricostruisco __dirname in ambiente ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/*MIDDLEWARE JSON*/
app.use(express.json());

//CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Cartella per ulpoads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);


//START SERVER
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database connected');

    app.listen(3000, () => {
      console.log('Server ready on http://localhost:3000');

      setInterval(() => {}, 1000000);
    });
  } catch (error) {
    console.error('Error while connecting DB', error);
    process.exit(1);
  }
};


startServer();