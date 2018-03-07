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

function getTruckAccidentCheck(params,callback) {
    var query = " select tac.*,ta.accident_status,u.real_name as op_user_name from truck_accident_check tac " +
        " left join truck_accident_info ta on tac.truck_accident_id = ta.id " +
        " left join user_info u on tac.op_user_id = u.uid " +
        " where tac.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckAccidentCheckId){
        paramsArray[i++] = params.truckAccidentCheckId;
        query = query + " and tac.id = ? ";
    }
    if(params.truckAccidentId){
        paramsArray[i++] = params.truckAccidentId;
        query = query + " and tac.truck_accident_id = ? ";
    }
    if(params.underUserId){
        paramsArray[i++] = params.underUserId;
        query = query + " and tac.under_user_id = ? ";
    }
    if(params.underUserName){
        paramsArray[i++] = params.underUserName;
        query = query + " and tac.under_user_name = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentCheck ');
        return callback(error,rows);
    });
}

function updateTruckAccidentCheck(params,callback){
    var query = " update truck_accident_check set truck_accident_type = ? , under_user_id = ? , under_user_name = ? , under_cost = ? , " +
        " company_cost = ? , profit = ? , op_user_id = ? remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckAccidentType;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.underUserName;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.truckAccidentCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentCheck ');
        return callback(error,rows);
    });
}

function updateTruckAccidentCheckFinishTime(params,callback){
    var query = " update truck_accident_check set op_user_id = ? , end_date = ? , date_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.truckAccidentCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentCheckFinishTime ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccidentCheck : addTruckAccidentCheck,
    getTruckAccidentCheck : getTruckAccidentCheck,
    updateTruckAccidentCheck : updateTruckAccidentCheck,
    updateTruckAccidentCheckFinishTime : updateTruckAccidentCheckFinishTime
}

