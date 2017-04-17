/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParkingDAO.js');

function updateStorageParking(params,callback){
    var query = " update storage_parking set car_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.parkingId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParking ');
        return callback(error,rows);
    });
}


module.exports ={
    updateStorageParking : updateStorageParking
}
