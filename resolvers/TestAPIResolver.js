import {FortuneCookie} from "../connectors/TestAPI";

export const resolvers = {
    Query: {
        getFortuneCookie(){
            return FortuneCookie.getOne();
        }
    },
    Mutation:{

    }
};