/**
 * Created by zwl on 2018/6/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePeccancyDAO.js');

function addDrivePeccancy(params,callback){
    var query = " insert into drive_peccancy (drive_id,truck_id,fine_score,fine_money,start_date,end_date,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.fineScore;
    paramsArray[i++]=params.fineMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDrivePeccancy ');
        return callback(error,rows);
    });
}

function getDrivePeccancy(params,callback) {
    var query = " select dp.*,d.drive_name,t.truck_num from drive_peccancy dp " +
        " left join drive_info d on dp.drive_id = d.id " +
        " left join truck_info t on dp.truck_id = t.id " +
        " where dp.id is not null ";
    var paramsArray=[],i=0;
    if(params.peccancyId){
        paramsArray[i++] = params.peccancyId;
        query = query + " and dp.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dp.drive_id = ? ";
    }
    if(params.fineStatus){
        paramsArray[i++] = params.fineStatus;
        query = query + " and dp.fine_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrivePeccancy ');
        return callback(error,rows);
    });
}

function updateDrivePeccancy(params,callback){
    var query = " update drive_peccancy set drive_id = ? , truck_id = ? , fine_score = ? , fine_money = ? , start_date = ? , end_date = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.fineScore;
    paramsArray[i++]=params.fineMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.peccancyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrivePeccancy ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrivePeccancy : addDrivePeccancy,
    getDrivePeccancy : getDrivePeccancy,
    updateDrivePeccancy : updateDrivePeccancy
}