import Sequelize from "sequelize";

const db = new Sequelize('blog', null, null, {
    dialect: 'sqlite',
    storage: './blog.sqlite',
});

const UserModel = db.define('user', {
    username: { type:Sequelize.STRING },
    password: { type:Sequelize.STRING },
    email: { type:Sequelize.STRING },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    role: {type: Sequelize.STRING }
});

db.sync();
const User = db.models.user;

export { User };