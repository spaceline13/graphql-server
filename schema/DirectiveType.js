export default `
directive @isAuthenticated on QUERY | FIELD | FIELD_DEFINITION
directive @hasRole(role: [String]) on QUERY | FIELD | FIELD_DEFINITION
directive @isOwner on QUERY | FIELD | FIELD_DEFINITION
`