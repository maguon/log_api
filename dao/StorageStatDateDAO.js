/**
 * Created by zwl on 2017/4/20.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageStatDateDAO.js');

function getStorageStatDate(params,callback) {
    var query = " select d.* from storage_stat_date d left join storage_info s on d.storage_id = s.id where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and date_format(d.date_id,'%Y%m') = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageStatDate ');
        return callback(error,rows);
    });
}


module.exports ={
    getStorageStatDate : getStorageStatDate
}