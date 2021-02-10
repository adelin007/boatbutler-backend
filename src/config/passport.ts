import passport from "passport";
import {ExtractJwt, StrategyOptions, Strategy as JwtStrategy } from "passport-jwt";
import {JWT_SECRET} from "../utils/definitions";
import {UserInterface, UserRole} from "../models/User";
import {getCompanyUserById, getUserById} from "../services/userService";


const opts: StrategyOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : JWT_SECRET,
};

interface JWTPayload{
    user_id: UserInterface['id'];
    user_role: UserInterface['user_role']
}
passport.use(new JwtStrategy(opts, async(jwtPayload: JWTPayload, callback) => {
    if(jwtPayload.user_role === UserRole.USER){

        return callback(null, false, "NOT A COMPANY USER");
        
    } else if(jwtPayload.user_role === UserRole.COMPANY){
        try{
            const user = await getCompanyUserById(jwtPayload.user_id);
            if(!user){
                  throw new Error("Could not find user with company");
            } 
            return callback(null, user);
          
        }catch(err){
            return callback(err);
        }
    }
  
}));

