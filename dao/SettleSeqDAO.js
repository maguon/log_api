/**
 * Created by zwl on 2018/6/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleSeqDAO.js');

function addSettleSeq(params,callback){
    var query = " insert into settle_seq (y_month,seq_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.yMonth;
    paramsArray[i++]=params.seqId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleSeq ');
        return callback(error,rows);
    });
}

function getSettleSeq(params,callback) {
    var query = " select * from settle_seq where y_month is not null ";
    var paramsArray=[],i=0;
    query = query + ' order by seq_id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleSeq ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleSeq : addSettleSeq,
    getSettleSeq : getSettleSeq
}
