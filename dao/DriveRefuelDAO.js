/**
 * Created by zwl on 2017/9/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveRefuelDAO.js');

function addDriveRefuel(params,callback){
    var query = " insert into drive_refuel (drive_id,truck_id,date_id,refuel_date,refuel_volume,city_route_id, " +
        "refuel_address_type,refuel_address,lng,lat,refuel_money) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.refuelDate;
    paramsArray[i++]=params.refuelVolume;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.refuelAddressType;
    paramsArray[i++]=params.refuelAddress;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i]=params.refuelMoney;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveRefuel ');
        return callback(error,rows);
    });
}

function getDriveRefuel(params,callback) {
    var query = " select dr.*,d.drive_name,t.truck_num,cr.route_start,cr.route_end,u.real_name as check_user_name " +
        " from drive_refuel dr " +
        " left join drive_info d on dr.drive_id = d.id " +
        " left join truck_info t on dr.truck_id = t.id " +
        " left join city_route_info cr on dr.city_route_id = cr.id " +
        " left join user_info u on dr.check_user_id = u.uid where dr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveRefuelId){
        paramsArray[i++] = params.driveRefuelId;
        query = query + " and dr.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.refuelAddressType){
        paramsArray[i++] = params.refuelAddressType;
        query = query + " and dr.refuel_address_type = ? ";
    }
    if(params.refuelDateStart){
        paramsArray[i++] = params.refuelDateStart +" 00:00:00";
        query = query + " and dr.refuel_date >= ? ";
    }
    if(params.refuelDateEnd){
        paramsArray[i++] = params.refuelDateEnd +" 23:59:59";
        query = query + " and dr.refuel_date <= ? ";
    }
    if(params.checkStatus){
        paramsArray[i++] = params.checkStatus;
        query = query + " and dr.check_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveRefuel ');
        return callback(error,rows);
    });
}

function getRefuelVolumeMoneyTotal(params,callback) {
    var query = " select sum(dr.refuel_volume) as refuel_volume,sum(dr.refuel_money) as refuel_money " +
        " from drive_refuel dr " +
        " left join drive_info d on dr.drive_id = d.id " +
        " left join truck_info t on dr.truck_id = t.id " +
        " left join city_route_info cr on dr.city_route_id = cr.id " +
        " left join user_info u on dr.check_user_id = u.uid where dr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveRefuelId){
        paramsArray[i++] = params.driveRefuelId;
        query = query + " and dr.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.refuelAddressType){
        paramsArray[i++] = params.refuelAddressType;
        query = query + " and dr.refuel_address_type = ? ";
    }
    if(params.refuelDateStart){
        paramsArray[i++] = params.refuelDateStart +" 00:00:00";
        query = query + " and dr.refuel_date >= ? ";
    }
    if(params.refuelDateEnd){
        paramsArray[i++] = params.refuelDateEnd +" 23:59:59";
        query = query + " and dr.refuel_date <= ? ";
    }
    if(params.checkStatus){
        paramsArray[i++] = params.checkStatus;
        query = query + " and dr.check_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRefuelVolumeMoneyTotal ');
        return callback(error,rows);
    });
}

function updateDriveRefuelStatus(params,callback){
    var query = " update drive_refuel set check_status = ? , check_reason = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.checkStatus;
    paramsArray[i++] = params.checkReason;
    paramsArray[i] = params.driveRefuelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveRefuelStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveRefuel: addDriveRefuel,
    getDriveRefuel : getDriveRefuel,
    getRefuelVolumeMoneyTotal : getRefuelVolumeMoneyTotal,
    updateDriveRefuelStatus : updateDriveRefuelStatus
}
