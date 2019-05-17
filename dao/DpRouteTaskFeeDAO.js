/**
 * Created by zwl on 2019/5/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskFeeDAO.js');

function addDpRouteTaskFee(params,callback){
    var query = " insert into dp_route_task_fee (drive_id,drive_name,truck_id,truck_num," +
        " day_count,single_price,total_price) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function getDpRouteTaskFee(params,callback) {
    var query = " select * from dp_route_task_fee where id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskFeeId){
        paramsArray[i++] = params.dpRouteTaskFeeId;
        query = query + " and id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskFee(params,callback){
    var query = " update dp_route_task_fee set day_count = ? , single_price = ? , total_price = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i++] = params.dpRouteTaskFeeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskFeeStatus(params,callback){
    var query = " update dp_route_task_fee set status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.dpRouteTaskFeeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskFeeStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskFee : addDpRouteTaskFee,
    getDpRouteTaskFee : getDpRouteTaskFee,
    updateDpRouteTaskFee : updateDpRouteTaskFee,
    updateDpRouteTaskFeeStatus : updateDpRouteTaskFeeStatus
}