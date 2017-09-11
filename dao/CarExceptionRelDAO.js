/**
 * Created by zwl on 2017/9/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarExceptionRelDAO.js');

function addCarExceptionRelDAO(params,callback){
    var query = " insert into car_exception_rel (car_id,remark) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarExceptionRelDAO ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarExceptionRelDAO : addCarExceptionRelDAO
}
