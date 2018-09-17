import {User} from "../connectors/User";
var filter = require('filter-object');

export const authorization = {
    isAuthenticated: (next, source, args, {user}) => {
        if (!user) {
            throw new Error("Authentication error: You must login!");
        } else {
            return next();
        }
    },
    hasRole: async (next, source, {role}, {user}) => {
        if (!user) {
            throw new Error("Authentication error: You must login!");
        } else {
            const res = await User.findOne({
                where:{
                    id: user.id,
                    role: role
                }
            });
            if (res) {
                return next();
            } else {
                throw new Error("Authorization error: You must be " + role);
            }
        }
    },
    isOwner: async (next, source, {role}, {user}) => {
        if (!user) {
            throw new Error("Authentication error: You must login!");
        } else {
             return next().then((data)=>{

             });

        }
    },
}

