/**
 * Created by zwl on 2018/4/16.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePayDAO.js');

function getDrivePay(params,callback) {
    var query = " select dp.*,d.drive_name,c.company_name,c.operate_type,t.truck_num,tb.brand_name " +
        " from drive_pay dp " +
        " left join drive_info d on dp.drive_id = d.id " +
        " left join company_info c on d.company_id = c.id " +
        " left join truck_info t on dp.truck_id = t.id" +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " where dp.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthDateId){
        paramsArray[i++] = params.monthDateId;
        query = query + " and dp.month_date_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dp.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckBrandId){
        paramsArray[i++] = params.truckBrandId;
        query = query + " and t.brand_id = ? ";
    }
    if(params.payStatus){
        paramsArray[i++] = params.payStatus;
        query = query + " and dp.pay_status = ? ";
    }
    query = query + ' group by dp.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrivePay ');
        return callback(error,rows);
    });
}


module.exports ={
    getDrivePay : getDrivePay
}