import {FortuneCookie} from "../connectors/TestAPI";

export default {
    Query: {
        getFortuneCookie(){
            return FortuneCookie.getOne();
        }
    },
    Mutation:{

    }
};