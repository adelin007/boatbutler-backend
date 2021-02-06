import express from 'express';
import * as userController from "../controllers/userController";

export const router = express.Router();

router.post('/createUser', userController.postNewUser);
router.get('/users', userController.getUsers);
// router.get('/users', )