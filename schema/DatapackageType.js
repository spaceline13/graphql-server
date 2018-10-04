export default `
scalar Upload

type Query {
    getAllDatapackages:[Datapackage] 
    getDatapackage(name:String!): Datapackage
}

type Mutation{
    uploadDatapackage(file:Upload!): String    
}

type Datapackage {
    name: String
    title: String
    profile: String
    description: String
    version: String
    author: String
    license: [License]
    keywords: [Keyword]
    resources: [Resource]
}

type Keyword {
	label: String
	value: String
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