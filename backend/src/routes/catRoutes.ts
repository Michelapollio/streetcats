import { Router } from 'express';
import { createCat, getAllCats } from '../controllers/catController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.post(
  '/',
  upload.single('photo'),   // il campo del file deve chiamarsi "photo"
  createCat
);

router.get('/', getAllCats);

export default router;
