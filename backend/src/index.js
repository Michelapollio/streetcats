import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import { register } from './controllers/authController.js';
const app = express();
app.use(express.json());
app.use(cors());
const startServer = async () => {
    try {
        // Sincronizza i modelli con il DB (Crea la tabella se non esiste)
        // Nota: 'alter: true' aggiorna le tabelle esistenti senza cancellarle
        await sequelize.sync({ alter: true });
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server ready on http://localhost:3000');
        });
    }
    catch (error) {
        console.error('Error while connecting DB', error);
    }
};
app.use('/api', register);
// Rotta rapida di test per creare un utente
/*app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});*/
startServer();
