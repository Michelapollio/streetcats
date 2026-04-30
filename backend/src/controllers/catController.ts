import { Request, Response } from 'express';
//import Cat from '../models/catModel.js';
//import Comment from '../models/commentModel.js';
import { Cat, Comment, User } from '../models/rel.js';

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

export const getAllCats = async (req: Request, res: Response) => {
  try {
    const cats = await Cat.findAll();
    return res.status(200).json(cats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving cats' });
  }
}

export const getCatById = async (req: Request, res: Response) => {
  try {
    const id  = req.params.id as string;


    //const allCats = await Cat.findAll();
    if (!id) {
      return res.status(400).json({ error: "ID mancante nella richiesta" });
    }
    
    const cat = await Cat.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['username'] }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    });

    if(!cat){
      return res.status(404).json({error: "Cat not found"});
    }

    res.status(200).json(cat);
  } catch(error){
    console.error("Errore recupero singolo gatto:", error);
    res.status(500).json({error: "Errore interno del server"});
  }
};

export const addCommentToCat = async (req:Request, res: Response) => {
  try {
    const {id} = req.params;
    const {text, userId} = req.body;

    if(!text || !userId){
      return res.status(400).json({error: "Text and User ID are required"});
    }

    //new comment
    const newComment = await Comment.create({
      catId: id as string,
      userId: userId,
      body: text,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Errore aggiunta commento:", error);
    return res.status(500).json({error: "Errore interno del server"});
  }
}

