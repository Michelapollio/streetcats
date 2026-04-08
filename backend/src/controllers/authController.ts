import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import User from '../models/userModel.js'
import {Op} from 'sequelize'

export const register = async (req:Request, res:Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{email:email}, {passwordHash:password}]
            } as any
        });

        if (existingUser){
            return res.status(400).json({
                error: "Registrazione fallita",
                message: existingUser.email === email
                    ? "email already registered"
                    : "username already used"
            });

        }

        //hashing 
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //creazione
        const newUser = await User.create({
            username,
            email,
            passwordHash
        });

        res.status(201).json({
            message: "User created!",
            userId: newUser.id
        });
    } catch (error: any){
        res.status(500).json({
            error: "Server Error", 
            message: error.message,
            stack: error.stack
        });
    };

}