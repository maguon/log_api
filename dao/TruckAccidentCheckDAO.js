/**
 * Created by zwl on 2018/2/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentCheckDAO.js');

function addTruckAccidentCheck(params,callback){
    var query = " insert into truck_accident_check (truck_accident_id,truck_accident_type,under_user_id,under_user_name,under_cost," +
        " company_cost,profit,op_user_id,remark) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckAccidentId;
    paramsArray[i++]=params.truckAccidentType;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.underUserName;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccidentCheck ');
        return callback(error,rows);
    });
}

function updateTruckAccidentCheck(params,callback){
    var query = " update truck_accident_check set truck_accident_type = ? , under_user_id = ? , under_user_name = ? , under_cost = ? , " +
        " company_cost = ? , profit = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckAccidentType;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.underUserName;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.truckAccidentCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentCheck ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccidentCheck : addTruckAccidentCheck,
    updateTruckAccidentCheck : updateTruckAccidentCheck
}

