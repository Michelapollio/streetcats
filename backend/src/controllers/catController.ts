import { Request, Response } from 'express';
import Cat from '../models/catModel.js';

export const createCat = async (req: Request, res: Response) => {
  try {
    console.log("BODY RICEVUTO: ", req.body);
    console.log("FILE RICEVUTO: ", req.file);

    const { title, descriptionMd, latitude, longitude, userId } = req.body;

    if(!userId){
      return res.status(400).json({error: 'User ID is required'});
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const photoUrl = `/uploads/cats/${req.file.filename}`;

    const newCat = await Cat.create({
      title,
      descriptionMd,
      photoUrl,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      userId
    });

    return res.status(201).json(newCat);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error saving cat' });
  }
};
