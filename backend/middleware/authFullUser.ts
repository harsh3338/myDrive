import jwt from "jsonwebtoken";
import User, {UserInterface} from "../models/user";
import env from "../enviroment/env";
import {Request, Response, NextFunction} from "express";

interface RequestType extends Request {
    user?: UserInterface,
    token?: string,
    encryptedToken?: string,
}

type jwtType = {
    iv: Buffer,
    user: userAccessType
}

type userAccessType = {
    _id: string,
    emailVerified: boolean,
    email: string,
    admin: boolean,
    botChecked: boolean,
    username: string,
}

const authFullUser = async(req: RequestType, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.cookies["access-token"];

        if (!accessToken) throw new Error("No Access Token");

        const decoded = jwt.verify(accessToken, env.passwordAccess!) as jwtType;

        const user = decoded.user;

        if (!user) throw new Error("No User");
        if (!user.emailVerified) throw new Error("Email Not Verified")

        const fullUser = await User.findById(user._id);

        if (!fullUser) throw new Error("No User");

        req.user = fullUser;

        next();

    } catch (e) {

        if (e.message !== "No Access Token" && 
        e.message !== "No User" &&
        e.message !== "Email Not Verified") console.log("\nAuthorization Full User Middleware Error:", e.message);
        
        res.status(401).send("Error Authenticating");
    }
}

export default authFullUser;


// import jwt from "jsonwebtoken";
// import User, {UserInterface} from "../models/user";
// import env from "../enviroment/env";
// import {Request, Response, NextFunction} from "express";

// interface RequestType extends Request {
//     user?: UserInterface,
//     token?: string,
//     encryptedToken?: string,
// }

// type jwtType = {
//     iv: Buffer,
//     _id: string,
// }

// const auth = async(req: RequestType, res: Response, next: NextFunction) => {

//     try {

//         const token = req.header("Authorization")!.replace("Bearer ", "");

//         const decoded = jwt.verify(token, env.passwordAccess!) as jwtType;

//         const iv = decoded.iv;
        
//         const user = await User.findOne({_id: decoded._id}) as UserInterface;
//         const encrpytionKey = user.getEncryptionKey();
    
//         const encryptedToken = user.encryptToken(token, encrpytionKey, iv);

//         let tokenFound = false;
//         for (let i = 0; i < user.tokens.length; i++) {

//             const currentToken = user.tokens[i].token;

//             //console.log("current token", currentToken === encryptedToken)
//             if (currentToken === encryptedToken) {
//                 tokenFound = true;
//                 break;
//             }
//         }

//         if (!user || !tokenFound) {

//             throw new Error("User not found")

//         } else if (user.emailVerified && user.botChecked) {

//             // TEMPORARY CHANGE THIS

//             req.token = token; 
//             req.encryptedToken = encryptedToken
//             req.user = user;
//             next();
//         } else {
//             throw new Error("Email Not Verified, or Bot not checked")
//         }

//     } catch (e) {
//         console.log(e);
//         res.status(401).send({error: "Error Authenticating"})
//     }
// }

// export default auth;
















// import jwt from "jsonwebtoken";
// import User, {UserInterface} from "../models/user";
// import env from "../enviroment/env";
// import {Request, Response, NextFunction} from "express";

// interface RequestType extends Request {
//     user?: UserInterface,
//     token?: string,
//     encryptedToken?: string,
// }

// type jwtType = {
//     iv: Buffer,
//     _id: string,
// }

// const auth = async(req: RequestType, res: Response, next: NextFunction) => {

//     try {

//         const token = req.header("Authorization")!.replace("Bearer ", "");

//         const decoded = jwt.verify(token, env.passwordAccess!) as jwtType;

//         const iv = decoded.iv;
        
//         const user = await User.findOne({_id: decoded._id}) as UserInterface;
//         const encrpytionKey = user.getEncryptionKey();
    
//         const encryptedToken = user.encryptToken(token, encrpytionKey, iv);

//         let tokenFound = false;
//         for (let i = 0; i < user.tokens.length; i++) {

//             const currentToken = user.tokens[i].token;

//             //console.log("current token", currentToken === encryptedToken)
//             if (currentToken === encryptedToken) {
//                 tokenFound = true;
//                 break;
//             }
//         }

//         if (!user || !tokenFound) {

//             throw new Error("User not found")

//         } else if (user.emailVerified) {

//             req.token = token; 
//             req.encryptedToken = encryptedToken
//             req.user = user;
//             next();
//         } else {
//             throw new Error("Email Not Verified")
//         }

//     } catch (e) {
//         console.log(e);
//         res.status(401).send({error: "Error Authenticating"})
//     }
// }

// export default auth;