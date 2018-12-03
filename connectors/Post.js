import SequelizeTunnelService from "sequelize-ssh-tunnel";
import Sequelize from "sequelize";
import {readFileSync} from "fs";

var dbConfig = {
    database: 'test',
    username: 'agroknow_user',
    password: '6NJ5ZPpX'
};
var tunnelConfig = {
    host: '18.188.111.81',
    port: 22,
    username: 'bitnami',
    privateKey: readFileSync('./gwpp')
};
var sequelizeTunnelService = new SequelizeTunnelService(dbConfig, tunnelConfig);

var Post = null;
sequelizeTunnelService.getConnection().then((db) => {
    db.sequelize.define('post', {
        title: { type: Sequelize.STRING },
        text: { type: Sequelize.STRING },
        userId: { type: Sequelize.INTEGER },
        votes: { type: Sequelize.INTEGER },
        public: { type: Sequelize.BOOLEAN }
    },{
        timestamps:false
    });
    Post = db.sequelize.models.post;
});

export { Post };