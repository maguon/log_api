
/**
 * Created by ling xue on 14-4-11.
 * The file used to store the config parameter;
 * When publish new version on server ,reset the configuration parameters
 */


var mysqlConnectOptions ={
    user: 'log',
    password: 'logbase',
    database:'log_base',
    host: '127.0.0.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: [
        { type: 'console' },
        {
            "type": "file",
            "filename": "../logs/logistic.log",
            "maxLogSize": 2048000,
            "backups": 10
        }
    ]
}

function getMysqlConnectOptions (){
    return mysqlConnectOptions;
}

var mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/log'
}


module.exports = {
    getMysqlConnectOptions : getMysqlConnectOptions,
    loggerConfig : loggerConfig,
    logLevel : logLevel ,
    mongoConfig : mongoConfig
}
