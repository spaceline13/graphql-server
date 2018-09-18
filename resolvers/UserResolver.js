import {User} from "../connectors/User";
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

export const resolvers = {
    Query: {
        getUser(_, args) {
            return User.find({ where: args });
        },
        allUsers(_, args, {user}) {
            return User.findAll();
        }
    },
    Mutation:{
        async addUser(_, args){
            const pass = await bcrypt.hash(args.password, 10);
            console.log(pass);
            var newUser = {id: null, username:args.username, password:pass, email:args.email};
            await User.findAll({ //first find the last user id
                limit: 1,
                order: [ [ 'id', 'DESC' ]]
            }).then(function(entries){ //then increment it and insert the new user with the new id
                var newId = 1;
                if (entries.length>0)
                    newId = parseInt(entries[0].dataValues.id)+1;
                newUser['id'] = newId;
                User.create( newUser );
            });
            const token = jsonwebtoken.sign(
                { id: newUser.id, username: newUser.username },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            );
            return {user:newUser, token:token};
        },
        removeUser(_,args){
            User.destroy({
                where: {
                    id:args.id
                }
            })
        },
        async login(_,args){
            const user = await User.findOne({
                where: {
                    username: args.username
                }
            });
            if (!user) {
                throw new Error('No user with that email')
            }
            const valid = await bcrypt.compare(args.password, user.password);
            if (!valid) {
                throw new Error('Incorrect password')
            }
            const token = jsonwebtoken.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            );
            return {user:user, token:token};
        }
    }
};
