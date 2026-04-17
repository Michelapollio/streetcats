import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import sequelize from './config/database.js';
import User from './models/userModel.js';
import { login, register } from './controllers/authController.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api', authRoutes);
app.post('/api/register', register);
//app.post('/api/login', login);

const startServer = async () => {
  try {
    // Sincronizza i modelli con il DB (Crea la tabella se non esiste)
    // Nota: 'alter: true' aggiorna le tabelle esistenti senza cancellarle
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