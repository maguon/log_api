/**
 * Created by zwl on 2017/9/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveRefuelDAO.js');

function addDriveRefuel(params,callback){
    var query = " insert into drive_refuel (drive_id,truck_id,date_id,refuel_date,refuel_volume,dp_route_task_id, " +
        "refuel_address_type,refuel_address,lng,lat,refuel_money) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.refuelDate;
    paramsArray[i++]=params.refuelVolume;
    paramsArray[i++]=params.dpRouteTaskId;
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
    var query = " select dr.*,d.drive_name,t.truck_num," +
        " dpt.route_start_id,dpt.route_end_id,c.city_name route_start,ce.city_name route_end,dpt.distance,dpt.load_flag," +
        " u.real_name as check_user_name " +
        " from drive_refuel dr " +
        " left join drive_info d on dr.drive_id = d.id " +
        " left join truck_info t on dr.truck_id = t.id " +
        " left join dp_route_task dpt on dr.dp_route_task_id = dpt.id " +
        " left join city_info c on dpt.route_start_id = c.id " +
        " left join city_info ce on dpt.route_end_id = ce.id " +
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
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dr.dp_route_task_i = ? ";
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
    query = query + '  order by dr.refuel_date desc ';
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
    var query = " update drive_refuel set check_status = ? , check_reason = ? , check_user_id = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.checkStatus;
    paramsArray[i++] = params.checkReason;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.driveRefuelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveRefuelStatus ');
        return callback(error,rows);
    });
}

function getRefuelMonthStat(params,callback) {
    var query = "select sum(dr.refuel_volume) total_vol ,sum(dr.refuel_money) total_money , dr.refuel_address_type ,db.y_month " +
        " from date_base db left join drive_refuel dr on db.id = dr.date_id " +
        " where dr.refuel_address_type is not null and  dr.check_status=2 " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + ' and db.y_month >= ? '
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + ' and db.y_month <= ? '
    }
    query = query + " group by db.y_month,dr.refuel_address_type  order by db.y_month desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRefuelMonthStat ');
        return callback(error,rows);
    });
}

function getRefuelWeekStat(params,callback) {
    var query = "select sum(dr.refuel_volume) total_vol ,sum(dr.refuel_money) total_money , dr.refuel_address_type ,db.y_week " +
        " from date_base db left join drive_refuel dr on db.id = dr.date_id " +
        " where dr.refuel_address_type is not null and  dr.check_status=2 " ;
    var paramsArray=[],i=0;
    if(params.weekStart){
        paramsArray[i++] = params.weekStart;
        query = query + ' and db.y_week >= ? '
    }
    if(params.weekEnd){
        paramsArray[i++] = params.weekEnd;
        query = query + ' and db.y_week <= ? '
    }
    query = query + " group by db.y_week,dr.refuel_address_type  order by db.y_week desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRefuelWeekStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveRefuel: addDriveRefuel,
    getDriveRefuel : getDriveRefuel,
    getRefuelVolumeMoneyTotal : getRefuelVolumeMoneyTotal,
    updateDriveRefuelStatus : updateDriveRefuelStatus ,
    getRefuelMonthStat  : getRefuelMonthStat ,
    getRefuelWeekStat : getRefuelWeekStat
}
