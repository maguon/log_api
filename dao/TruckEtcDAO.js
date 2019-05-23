/**
 * Created by zwl on 2019/5/9.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckEtcDAO.js');

function addUploadTruckEtc(params,callback){
    var query = "insert into truck_etc (truck_id,truck_num,drive_id,drive_name,etc_fee,etc_date, " +
        " date_id,remark,op_user_id,upload_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.etcFee;
    paramsArray[i++]=params.etcDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addUploadTruckEtc ');
        return callback(error,rows);
    })
}

function getTruckEtc(params,callback) {
    var query = " select te.*,u.real_name as op_user_name from truck_etc te " +
        " left join user_info u on te.op_user_id = u.uid " +
        " where te.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckEtcId){
        paramsArray[i++] = params.truckEtcId;
        query = query + " and te.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and te.truck_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and te.drive_id = ? ";
    }
    if(params.etcDateStart){
        paramsArray[i++] = params.etcDateStart +" 00:00:00";
        query = query + " and te.etc_date >= ? ";
    }
    if(params.etcDatenEnd){
        paramsArray[i++] = params.etcDatenEnd +" 23:59:59";
        query = query + " and te.etc_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and te.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and te.created_on <= ? ";
    }
    query = query + ' order by te.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckEtc ');
        return callback(error,rows);
    });
}

function getTruckEtcFeeCount(params,callback) {
    var query = " select sum(te.etc_fee) as etc_fee from truck_etc te " +
        " where te.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and te.truck_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and te.drive_id = ? ";
    }
    if(params.etcDateStart){
        paramsArray[i++] = params.etcDateStart +" 00:00:00";
        query = query + " and te.etc_date >= ? ";
    }
    if(params.etcDatenEnd){
        paramsArray[i++] = params.etcDatenEnd +" 23:59:59";
        query = query + " and te.etc_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and te.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and te.created_on <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckEtcFeeCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addUploadTruckEtc : addUploadTruckEtc,
    getTruckEtc : getTruckEtc,
    getTruckEtcFeeCount : getTruckEtcFeeCount
}