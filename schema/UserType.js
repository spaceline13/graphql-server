export default `
type Query {
    getMe: User @isAuthenticated
    getUser(id:Int!): User @hasRole(role: ["ADMIN"]) @isAuthenticated
    getAllUsers: [User] @hasRole(role: ["ADMIN"]) @isAuthenticated
}
type Mutation {
    addUser(id: Int,username: String!,password: String!, email: String!, role: String!): AuthPayload
    login (username: String!, password: String!): AuthPayload
    editUser(id:Int!, username: String, email: String, role: String): Int
    removeUser(id:Int!):User
}

type AuthPayload {
    token: String
    user: User
}
type User {
    id: Int
    username: String
    password: String
    email: String
    firstName: String
    lastName: String
    posts: [Post]
    role: String
}
`
