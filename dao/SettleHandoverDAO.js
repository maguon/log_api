/**
 * Created by zwl on 2018/6/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverDAO.js');

function addSettleHandover(params,callback){
    var query = " insert into settle_handover_info (number,entrust_id,op_user_id,remark) values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandover ');
        return callback(error,rows);
    });
}

function getSettleHandover(params,callback) {
    var query = " select * from settle_handover_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.settleHandoverId){
        paramsArray[i++] = params.settleHandoverId;
        query = query + " and id = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and number = ? ";
    }
    query = query + ' order by id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandover ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleHandover : addSettleHandover,
    getSettleHandover : getSettleHandover
}