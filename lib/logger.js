const SimpleNodeLogger = require('simple-node-logger');
const opts = {
    logFilePath:'logfile.log',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
};
const log = SimpleNodeLogger.createSimpleLogger( opts );
exports.log = log;