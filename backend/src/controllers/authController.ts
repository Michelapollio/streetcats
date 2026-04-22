import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'
import {Op} from 'sequelize';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export const register = async (req:Request, res:Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{email:email}, {username:username}]
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

export const login = async (req: Request, res: Response) => {
    try {
        console.log("LOGIN CONTROLLER RICEVUTO");
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {email}
        });

        if (!user){
            return res.status(404).json({message:'User not found'});
        }
        //console.log("Password inviata:", password);
        //console.log("Hash nel DB:", user.passwordHash);

        if(!user.passwordHash){
            return res.status(500).json({message:"Error: user not in DB"});
        }
        //confronto password e hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch){
            return res.status(401).json({
                message: "Incorrect password"
            });
        }
        //generazione del token
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
        },
        JWT_SECRET, {expiresIn: "1h"});

        //risposta di successo
        return res.status(200).json({
            message:"Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error: any){
        return res.status(500).json({
            error: "Server Error",
            message: error.message
        });
    }
};