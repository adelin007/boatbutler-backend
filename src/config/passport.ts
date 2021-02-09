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
    //TODO restrict normal users from accessing the platform, only company users should be able to
    if(jwtPayload.user_role === UserRole.USER){
        // try{
        //     const user = await getUserById(jwtPayload.user_id);
        //     if(!user){
        //           throw new Error("Could not find user");
        //     } 
        //     return callback(null, user);
          
            
        // }catch(err){
        //     return callback(err);
        // }

        // restrict normal Users from accessing company web portal
        return callback("NOT A COMPANY USER");

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

