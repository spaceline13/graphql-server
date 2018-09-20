export default `
type Query {
    getAllDatapackages:[Datapackage] 
    getDatapackage(name:String!): Datapackage
}

type Datapackage {
    name: String
    title: String
    profile: String
    description: String
    version: String
    author: String
    license: [License]
    keywords: [String]
    resources: [Resource]
}

type License {
    name: String
    title: String
    path: String
}

type Resource{
    name: String
    path: String
}
`