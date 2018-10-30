export default `
scalar Upload

type Query {
    getAllDatapackages:[Datapackage] 
    getDatapackage(name:String!): Datapackage
    getMyDatapackages:[Datapackage] @isAuthenticated
}

type Mutation{
    uploadResource(file:Upload!): [Resource] @isAuthenticated
    uploadDatapackage(datapackage:DatapackageInput!): String @isAuthenticated   
    setDoi(name:String!, doi:String!): Boolean @isAuthenticated  
    deleteDatapackage(name:String!): Boolean @isAuthenticated
}

type Datapackage {
    name: String
    title: String
    creator: [String]
    description: String
    publisher: [String]
    license: [License]
    contributor: [String]
    subject: [Keyword]
    date: String
    type: String
    sources: [String]
    relation: [String]
    rights: String
    doi: String
    resources: [Resource]
}
input DatapackageInput {
    name: String
    title: String
    creator: [String]
    description: String
    publisher: [String]
    license: [LicenseInput]
    contributor: [String]
    subject: [KeywordInput]
    date: String
    type: String
    sources: [String]
    relation: [String]
    rights: String
    resources: [ResourceInput]
}

type Keyword {
	label: String
	value: String
}
input KeywordInput {
	label: String
	value: String
}

type License {
    name: String
    title: String
    path: String
}
input LicenseInput {
    name: String
    label: String
    title: String
    path: String
}

type Resource{
    name: String
    path: String
}
input ResourceInput{
    name: String
    path: String
}
`