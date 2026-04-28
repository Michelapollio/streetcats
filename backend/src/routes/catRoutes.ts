import { Router } from 'express';
import { createCat, getAllCats, getCatById, addCommentToCat} from '../controllers/catController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.post(
  '/',
  upload.single('photo'),   // il campo del file deve chiamarsi "photo"
  createCat
);

router.post('/:id/comments', addCommentToCat);

router.get('/', getAllCats);

router.get('/:id', getCatById);

export default router;
