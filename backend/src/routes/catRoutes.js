import { Router } from 'express';
import { createCat } from '../controllers/catController.js';
import { upload } from '../middlewares/upload.js';
const router = Router();
router.post('/', upload.single('photo'), // il campo del file deve chiamarsi "photo"
createCat);
export default router;
