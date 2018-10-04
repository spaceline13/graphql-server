export default `
type Query {
    getPosts: [Post] @isAuthenticated
    getAllPosts: [Post] 
    getFortuneCookie: String  @isAuthenticated
}
type Mutation {
    addPost(id:Int, title: String, text: String, public: Boolean): Post
    removePost(id:Int!):Post
}

type Post {
    id: Int
    title: String
    text: String
    votes: Int
    userId: Int
    public: Boolean
}
`