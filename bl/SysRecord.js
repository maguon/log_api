/**
 * Created by lingxue on 2017/4/24.
 */
var sysRecordDAO = require('../dao/SysRecordDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysRecord.js');

function saveCarRecord (req,res,next){
    var params = req.params;
    console.log(params);
    var recordParams ={};
    recordParams.userId = params.userId;
    recordParams.userType = req.headers['user-type'] || 9;
    recordParams.username = req.headers['user-name'] || 'admin';
    recordParams.content = params.carContent;
    sysRecordDAO.addRecord(req,params,function(error,result){
        if(error){
            logger.error('saveCarRecord ' + error.stack);
        }
        return next();
    })
}

module.exports ={
    saveCarRecord : saveCarRecord
}