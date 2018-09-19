import {Post} from "../connectors/Post";

export const resolvers = {
    Query: {
        getUserPosts(_,args, {user}){
            var posts = Post.findAll({
                where:{
                    userId:args.id
                }
            });
            return posts;
        },
        getPosts(_,args,{user}){
            var posts = Post.findAll({
                where:{
                    $or: [{public:1}, {userId:user.id}]
                }
            });
            return posts;
        },
        getAllPosts(_,args, ctx){
            return Post.findAll({

            });
        }
    },
    Mutation:{
        addPost(_,args,{user}){
            Post.findAll({
                limit:1,
                where:{
                },
                order: [ [ 'id', 'DESC' ]]
            }).then(function(entries){
                var newId = 1;
                if (entries.length>0)
                    newId = parseInt(entries[0].dataValues.id)+1;
                console.log(user.id);
                const newPost = {id:newId, title: args.title, text: args.text, votes: 0, userId: user.id, public:args.public};
                Post.create(newPost);
                return newPost;
            })
        },
        removePost(_,args){
            Post.destroy({
                where: {
                    id:args.id
                }
            })
        }
    }
};