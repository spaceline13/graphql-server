export default `
scalar Upload

type Query {
    getAllDatapackages:[Datapackage] 
    getDatapackage(name:String!): Datapackage
    getMyDatapackages:[Datapackage] @isAuthenticated
}

type Mutation{
    uploadDataset(file:Upload!): Resource @isAuthenticated
    uploadDatapackage(datapackage:DatapackageInput!): Boolean @isAuthenticated    
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
input DatapackageInput {
    name: String
    title: String
    profile: String
    description: String
    version: String
    author: String
    date: String
    license: [LicenseInput]
    keywords: [KeywordInput]
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