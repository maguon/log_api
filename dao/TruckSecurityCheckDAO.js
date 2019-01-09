/**
 * Created by zwl on 2019/1/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckSecurityCheckDAO.js');

function addTruckSecurityCheck(params,callback){
    var query = " insert into truck_security_check (truck_id,truck_type,drive_id,turn,turn_remark,braking,braking_remark,liquid,liquid_remark, " +
        " lighting,lighting_remark,transmission,transmission_remark,tyre,tyre_remark,suspension,suspension_remark,structure,structure_remark, " +
        " facilities,facilities_remark,link_device,link_device_remark,check_date,remark,check_user_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.turn;
    paramsArray[i++]=params.turnRemark;
    paramsArray[i++]=params.braking;
    paramsArray[i++]=params.brakingRemark;
    paramsArray[i++]=params.liquid;
    paramsArray[i++]=params.liquidRemark;
    paramsArray[i++]=params.lighting;
    paramsArray[i++]=params.lightingRemark;
    paramsArray[i++]=params.transmission;
    paramsArray[i++]=params.transmissionRemark;
    paramsArray[i++]=params.tyre;
    paramsArray[i++]=params.tyreRemark;
    paramsArray[i++]=params.suspension;
    paramsArray[i++]=params.suspensionRemark;
    paramsArray[i++]=params.structure;
    paramsArray[i++]=params.structureRemark;
    paramsArray[i++]=params.facilities;
    paramsArray[i++]=params.facilitiesRemark;
    paramsArray[i++]=params.linkDevice;
    paramsArray[i++]=params.linkDeviceRemark;
    paramsArray[i++]=params.checkDate;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckSecurityCheck ');
        return callback(error,rows);
    });
}

function getTruckSecurityCheck(params,callback) {
    var query = " select tsc.*,t.truck_num,d.drive_name,u.real_name as check_user_name " +
        " from truck_security_check tsc " +
        " left join truck_info t on tsc.truck_id = t.id " +
        " left join drive_info d on tsc.drive_id = d.id " +
        " left join user_info u on tsc.check_user_id = u.uid " +
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
        query = query + " and tsc.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and tsc.created_on <= ? ";
    }
    if(params.checkDateStart){
        paramsArray[i++] = params.checkDateStart;
        query = query + " and tsc.check_date >= ? ";
    }
    if(params.checkDateEnd){
        paramsArray[i++] = params.checkDateEnd;
        query = query + " and tsc.check_date <= ? ";
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
    var query = " update truck_security_check set drive_id = ? , turn = ? , turn_remark = ? , braking = ? , braking_remark = ? , " +
        " liquid = ? , liquid_remark = ? , lighting = ? , lighting_remark = ? , transmission = ? , transmission_remark = ? , " +
        " tyre = ? , tyre_remark = ? , suspension = ? , suspension_remark = ? , structure = ? , structure_remark = ?, " +
        " facilities = ? , facilities_remark = ? , link_device = ? , link_device_remark = ? , check_date = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.turn;
    paramsArray[i++]=params.turnRemark;
    paramsArray[i++]=params.braking;
    paramsArray[i++]=params.brakingRemark;
    paramsArray[i++]=params.liquid;
    paramsArray[i++]=params.liquidRemark;
    paramsArray[i++]=params.lighting;
    paramsArray[i++]=params.lightingRemark;
    paramsArray[i++]=params.transmission;
    paramsArray[i++]=params.transmissionRemark;
    paramsArray[i++]=params.tyre;
    paramsArray[i++]=params.tyreRemark;
    paramsArray[i++]=params.suspension;
    paramsArray[i++]=params.suspensionRemark;
    paramsArray[i++]=params.structure;
    paramsArray[i++]=params.structureRemark;
    paramsArray[i++]=params.facilities;
    paramsArray[i++]=params.facilitiesRemark;
    paramsArray[i++]=params.linkDevice;
    paramsArray[i++]=params.linkDeviceRemark;
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