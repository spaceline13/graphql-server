import { SchemaDirectiveVisitor } from 'graphql-tools'
import {User} from "../connectors/User";

class hasRoleDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
        this.ensureFieldsWrapped(type);
        type._requiredAuthRole = this.args.role;
    }
    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType);
        field._requiredAuthRole = this.args.role;
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;
            field.resolve = async function (...args) {
                // Get the required Role from the field first, falling back
                // to the objectType if no Role is required by the field:
                const requiredRole =
                    field._requiredAuthRole ||
                    objectType._requiredAuthRole;

                args.myarg = 't';
                if (! requiredRole) {
                    return resolve.apply(this, args);
                }
                const {user} = args[2];
                const res = await User.findOne({
                    where:{
                        id: user.id,
                        role: requiredRole
                    }
                });
                if (!res) {
                    throw new Error("not authorized, needs to be "+requiredRole);
                }
                return resolve.apply(this, args);
            };
        });
    }
};

class isOwnerDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
        this.ensureFieldsWrapped(type);
        type._requiredAuthRole = this.args.role;
    }
    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType);
        field._requiredAuthRole = this.args.role;
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;
            field.resolve = async function (...args) {
                // Get the required Role from the field first, falling back
                // to the objectType if no Role is required by the field:
                const requiredRole =
                    field._requiredAuthRole ||
                    objectType._requiredAuthRole;

                if (! requiredRole) {
                    return resolve.apply(this, args);
                }
                const {user} = args[2];
                const res = await User.findOne({
                    where:{
                        id: user.id,
                        role: requiredRole
                    }
                });
                if (!res) {
                    throw new Error("not authorized, needs to be "+requiredRole);
                }
                console.log('test2',args);
                return resolve.apply(this, args);
            };
        });
    }
}
export const authDirectives = {
    //isAuthenticated: isAuthenticatedDirective,
    hasRole: hasRoleDirective,
    isOwner: isOwnerDirective
};
