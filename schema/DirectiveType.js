export default `
directive @isAuthenticated on QUERY | FIELD
directive @hasRole(role: [String]) on QUERY | FIELD
directive @isOwner on QUERY | FIELD
`