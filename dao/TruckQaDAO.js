/**
 * Created by yym on 2021/1/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckQaDAO.js');

function addUploadTruckQa(params,callback){
    var query = "insert into truck_qa (number,truck_id,truck_num,qa_type,qa_fee,tax_fee," +
        " qa_date,date_id,op_user_id,upload_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.qaType;
    paramsArray[i++]=params.qaFee;
    paramsArray[i++]=params.taxFee;
    paramsArray[i++]=params.qaDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addUploadTruckQa ');
        return callback(error,rows);
    })
}

function getTruckQa(params,callback) {
    var query = " select tq.*,u.real_name as op_user_name " +
        " from truck_qa tq " +
        " left join user_info u on tq.op_user_id = u.uid " +
        " where tq.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckQaId){
        paramsArray[i++] = params.truckQaId;
        query = query + " and tq.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and tq.truck_id = ? ";
    }
    if(params.qaType){
        paramsArray[i++] = params.qaType;
        query = query + " and tq.qa_type = ? ";
    }
    if(params.qaDateStart){
        paramsArray[i++] = params.qaDateStart +" 00:00:00";
        query = query + " and tq.qa_date >= ? ";
    }
    if(params.qaDateEnd){
        paramsArray[i++] = params.qaDateEnd +" 23:59:59";
        query = query + " and tq.qa_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and tq.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and tq.created_on <= ? ";
    }
    query = query + ' order by tq.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckQa ');
        return callback(error,rows);
    });
}

module.exports ={
    addUploadTruckQa : addUploadTruckQa,
    getTruckQa : getTruckQa
}