import express, {NextFunction, Request, Response} from 'express';
import bodyParser from "body-parser"
import cors from "cors";
import mongoose, {model, Document} from 'mongoose';
import * as dotenv from "dotenv";
import passport from "passport";
import {router} from "./routes";
import "./config/passport";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_URL;
if(!MONGO_DB_URL){
    throw new Error("NO MONGO URL ");
}
mongoose.connect(MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
  })


app.use('/api', router);


app.listen(process.env.PORT || 3001, () => {
    console.log(`RUNNING ON PORT: ${process.env.PORT}`)
  })