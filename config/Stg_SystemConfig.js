var mysqlConnectOptions ={
    user: 'log',
    password: 'log_base',
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
            "filename": "../stage/log_api.html",
            "maxLogSize": 20480,
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

var hosts = {
    record : {host:"stg.myxxjs.com",port:9004}
}

module.exports = {
    getMysqlConnectOptions : getMysqlConnectOptions,
    loggerConfig : loggerConfig,
    logLevel : logLevel ,
    mongoConfig : mongoConfig ,
    hosts : hosts
}
