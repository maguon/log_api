/**
 * Created by zwl on 2019/5/10.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveWorkDAO.js');

function addDriveWork(params,callback){
    var query = "insert into drive_work (drive_id,drive_name,truck_id,truck_num,mobile,y_month,work_count,hotel_fee,full_work_fee,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.mobile;
    paramsArray[i++]=params.yMonth;
    paramsArray[i++]=params.workCount;
    paramsArray[i++]=params.hotelFee;
    paramsArray[i++]=params.fullWorkFee;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addDriveWork ');
        return callback(error,rows);
    })
}

function getDriveWork(params,callback) {
    var query = " select dw.* from drive_work dw " +
        " where dw.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveWorkId){
        paramsArray[i++] = params.driveWorkId;
        query = query + " and dw.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dw.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dw.truck_id = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and dw.mobile = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and dw.y_month = ? ";
    }
    query = query + ' order by dw.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveWork ');
        return callback(error,rows);
    });
}

function updateDriveWork(params,callback){
    var query = " update drive_work set work_count = ? , hotel_fee = ?, full_work_fee = ?, remark = ? where id is not null " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.workCount;
    paramsArray[i++]=params.hotelFee;
    paramsArray[i++]=params.fullWorkFee;
    paramsArray[i++]=params.remark;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and y_month = ? ";
    }
    if(params.driveWorkId){
        paramsArray[i++] = params.driveWorkId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveWork ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveWork : addDriveWork,
    getDriveWork : getDriveWork,
    updateDriveWork : updateDriveWork
}