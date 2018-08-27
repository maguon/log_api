/**
 * Created by zwl on 2017/6/1.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustDAO.js');

function addEntrust(params,callback){
    var query = " insert into entrust_info (short_name,entrust_name,remark)  values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrust ');
        return callback(error,rows);
    });
}

function getEntrust(params,callback) {
    var query = " select * from entrust_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and id = ? ";
    }
    if(params.shortName){
        query = query + " and short_name like '%"+params.shortName+"%'";
    }
    if(params.entrustName){
        paramsArray[i++] = params.entrustName;
        query = query + " and entrust_name like '%"+params.entrustName+"%'";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrust ');
        return callback(error,rows);
    });
}

function getEntrustRoute(params,callback) {
    var query = " select e.*,count(ecrr.id) as route_count from entrust_info e " +
        " left join entrust_city_route_rel ecrr on e.id = ecrr.entrust_id " +
        " where e.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    query = query + ' group by e.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustRoute ');
        return callback(error,rows);
    });
}

function updateEntrust(params,callback){
    var query = " update entrust_info set short_name = ?,entrust_name = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrust ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrust : addEntrust,
    getEntrust : getEntrust,
    getEntrustRoute : getEntrustRoute,
    updateEntrust : updateEntrust
}