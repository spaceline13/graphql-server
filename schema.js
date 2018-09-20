export const schema = `
directive @isAuthenticated on QUERY | FIELD
directive @hasRole(role: [String]) on QUERY | FIELD
directive @isOwner on QUERY | FIELD

type Query {
    getMe: User @isAuthenticated
    getUser(id:Int!): User @hasRole(role: ["ADMIN"]) @isAuthenticated
    getAllUsers: [User] @hasRole(role: ["ADMIN"]) @isAuthenticated
    getUserPosts(user: Int): [Post] @isAuthenticated
    getPosts: [Post] @isAuthenticated 
    getAllPosts: [Post] @hasRole(role: ["ADMIN"]) 
}
type Mutation {
    addUser(id: Int,username: String!,password: String!, email: String!, role: String!): AuthPayload
    login (username: String!, password: String!): AuthPayload
    editUser(id:Int!, username: String, email: String, role: String): Int
    removeUser(id:Int!):User 
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
type File {
    id: Int
    title: String
    description: String
}
`;
