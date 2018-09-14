/**
 * Created by zwl on 2018/9/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustMakeRelDAO.js');

function addEntrustMakeRel(params,callback){
    var query = " insert into entrust_make_rel (entrust_id,make_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i]=params.makeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustMakeRel ');
        return callback(error,rows);
    });
}

function getEntrustMakeRel(params,callback) {
    var query = " select emr.*,cm.make_name from entrust_make_rel emr " +
        " left join car_make cm on emr.make_id = cm.id " +
        " where emr.entrust_id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and emr.entrust_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustMakeRel ');
        return callback(error,rows);
    });
}

function deleteEntrustMakeRel(params,callback){
    var query = " delete from entrust_make_rel where entrust_id = ? and make_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i]=params.makeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteEntrustMakeRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrustMakeRel : addEntrustMakeRel,
    getEntrustMakeRel : getEntrustMakeRel,
    deleteEntrustMakeRel : deleteEntrustMakeRel
}
