import {User} from "../connectors/User";
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

export default {
    Query: {
        getUser(_, args) {
            return User.find({ where: args });
        },
        getAllUsers(_, args, {user}) {
            return User.findAll();
        },
        getMe(_,args,{user}) {
            return User.findOne({
                where:{
                    id:user.id
                }
            })
        }
    },
    Mutation:{
        async addUser(_, args){
            const pass = await bcrypt.hash(args.password, 10);
            var token;
            var newUser = {id: null, username:args.username, password:pass, email:args.email, role:args.role};
            await User.findAll({ //first find the last user id
                limit: 1,
                order: [ [ 'id', 'DESC' ]]
            }).then(async function(entries){ //then increment it and insert the new user with the new id
                var newId = 1;
                if (entries.length>0)
                    newId = parseInt(entries[0].dataValues.id)+1;
                newUser['id'] = newId;
                await User.create( newUser ).then(function(user) {
                        token = jsonwebtoken.sign(
                            { id: newUser.id, username: newUser.username },
                            process.env.JWT_SECRET,
                            { expiresIn: '1y' }
                        );
                        console.log('success',user);
                    }).catch(function(err) {
                        console.log(err);
                    });
            });
            console.log(token,'s');
            return {user:newUser, token:token};
        },
        async editUser(_, args){
            var newUser = {username:args.username, email:args.email, role:args.role};
            var count = 0;
            await User.update(newUser,{where:{
                id:args.id
            }}).spread((affectedCount, affectedRows) => {
                count = affectedCount;
            });
            return count;
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
                throw new Error('No user with that username')
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
