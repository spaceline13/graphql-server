export default `
type Query {
    getPosts: [Post] @isAuthenticated
    getAllPosts: [Post] @hasRole(role: ["ADMIN"])
    getFortuneCookie: String @cacheControl(maxAge: 5) @isAuthenticated
}
type Mutation {
    addPost(id:Int, title: String, text: String, public: Boolean): Post @hasRole(role: "USER")
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