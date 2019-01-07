/**
 * Created by zwl on 2019/1/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckSecurityCheckDAO.js');

function addTruckSecurityCheck(params,callback){
    var query = " insert into truck_security_check (truck_id,truck_type,turn,braking,lighting,transmission, " +
        " tyre,structure,facilities,link_device,check_date,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.turn;
    paramsArray[i++]=params.braking;
    paramsArray[i++]=params.lighting;
    paramsArray[i++]=params.transmission;
    paramsArray[i++]=params.tyre;
    paramsArray[i++]=params.structure;
    paramsArray[i++]=params.facilities;
    paramsArray[i++]=params.linkDevice;
    paramsArray[i++]=params.checkDate;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckSecurityCheck ');
        return callback(error,rows);
    });
}

function getTruckSecurityCheck(params,callback) {
    var query = " select tsc.*,t.truck_num from truck_security_check tsc " +
        " left join truck_info t on tsc.truck_id = t.id " +
        " where tsc.id is not null ";
    var paramsArray=[],i=0;
    if(params.securityCheckId){
        paramsArray[i++] = params.securityCheckId;
        query = query + " and tsc.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and tsc.truck_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and dp.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and dp.created_on <= ? ";
    }
    if(params.checkDateStart){
        paramsArray[i++] = params.checkDateStart;
        query = query + " and dp.check_date >= ? ";
    }
    if(params.checkDateEnd){
        paramsArray[i++] = params.checkDateEnd;
        query = query + " and dp.check_date <= ? ";
    }
    query = query + '  order by tsc.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckSecurityCheck ');
        return callback(error,rows);
    });
}

function updateTruckSecurityCheck(params,callback){
    var query = " update truck_security_check set turn = ? , braking = ? , lighting = ? , transmission = ? , " +
        " tyre = ? , structure = ? , facilities = ? , link_device = ? , check_date = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.turn;
    paramsArray[i++]=params.braking;
    paramsArray[i++]=params.lighting;
    paramsArray[i++]=params.transmission;
    paramsArray[i++]=params.tyre;
    paramsArray[i++]=params.structure;
    paramsArray[i++]=params.facilities;
    paramsArray[i++]=params.linkDevice;
    paramsArray[i++]=params.checkDate;
    paramsArray[i++]=params.remark;
    paramsArray[i] = params.securityCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckSecurityCheck ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckSecurityCheck : addTruckSecurityCheck,
    getTruckSecurityCheck : getTruckSecurityCheck,
    updateTruckSecurityCheck : updateTruckSecurityCheck
}