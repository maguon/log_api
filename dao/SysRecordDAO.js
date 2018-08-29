/**
 * Created by lingxue on 2017/4/24.
 */

var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysRecordDAO.js');
var httpUtil =  require('../util/HttpUtil.js');
var sysConfig =  require('../config/SystemConfig.js');

function addRecord(req,params,callback){
    var url = '/api/car/'+params.carId+'/vin/'+params.vin+"/record";
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addTruckRecord(req,params,callback){
    var url = '/api/truckRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addDriverRecord(req,params,callback) {
    var url = '/api/tuser/'+params.tid+'/record';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addRouteRecord(req,params,callback) {
    var url = '/api/routeRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addReceiverRecord(req,params,callback) {
    var url = '/api/receiverRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addEntrustRecord(req,params,callback){
    var url = '/api/entrust/'+params.entrustId+'/cityRouteId/'+params.cityRouteId+"/entrustRecord";
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

module.exports ={
    addRecord : addRecord,
    addTruckRecord : addTruckRecord ,
    addDriverRecord : addDriverRecord,
    addRouteRecord : addRouteRecord ,
    addReceiverRecord : addReceiverRecord,
    addEntrustRecord : addEntrustRecord
}