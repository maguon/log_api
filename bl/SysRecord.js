/**
 * Created by lingxue on 2017/4/24.
 */
var sysRecordDAO = require('../dao/SysRecordDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysRecord.js');

var sysError = require('../util/SystemError.js');
function checkUserStatus (req,res,next){
    var params = req.params;
    if(params._uid && params._utype && params._uname){
        return next();
    }else{
        throw sysError.NotAuthorizedError(error.message,sysMsg.SYS_AUTH_TOKEN_ERROR);
    }
}

function saveCarRecord (req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.carContent;
        recordParams.carId = params.carId;
        if(params.unique ==1){
            recordParams.unique = params.unique;
        }
        recordParams.makeId = params.makeId;
        recordParams.makeName = params.makeName;
        recordParams.vin = params.vin;
        recordParams.op = params.op;
        sysRecordDAO.addRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveCarRecord ' + error.stack);
            }else{
                logger.info('saveCarRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}

function saveTruckRecord(req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.truckContent;
        recordParams.vhe = params.vhe;
        recordParams.op = params.truckOp;
        sysRecordDAO.addTruckRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveTruckRecord ' + error.stack);
            }else{
                logger.info('saveTruckRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}

function saveDriverRecord(req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.driverContent;
        recordParams.tid = params.tid;
        recordParams.op = params.driverOp;
        sysRecordDAO.addDriverRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveDriverRecord ' + error.stack);
            }else{
                logger.info('saveDriverRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}


function saveRouteRecord(req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.routeContent;
        recordParams.routeId = params.routeId;
        recordParams.op = params.routeOp;
        sysRecordDAO.addRouteRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveRouteRecord ' + error.stack);
            }else{
                logger.info('saveRouteRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}

function saveReceiverRecord(req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.receiverId = params.receiveId;
        recordParams.content = params.receiverContent;
        sysRecordDAO.addReceiverRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveReceiverRecord ' + error.stack);
            }else{
                logger.info('saveReceiverRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}

function saveEntrustRecord (req,res,next){
    if(res._body.success){
        var params = req.params;
        console.log(params);
        var recordParams ={};
        recordParams.userId = params._uid;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.entrustContent;
        recordParams.entrustId = params.entrustId;
        recordParams.cityRouteId = params.cityRouteId;
        sysRecordDAO.addEntrustRecord(req,recordParams,function(error,result){
            if(error){
                logger.error('saveEntrustRecord ' + error.stack);
            }else{
                logger.info('saveEntrustRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}


module.exports ={
    checkUserStatus : checkUserStatus ,
    saveCarRecord : saveCarRecord ,
    saveTruckRecord : saveTruckRecord ,
    saveDriverRecord : saveDriverRecord ,
    saveRouteRecord : saveRouteRecord,
    saveReceiverRecord : saveReceiverRecord,
    saveEntrustRecord : saveEntrustRecord
}