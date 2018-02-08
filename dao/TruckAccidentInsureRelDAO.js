/**
 * Created by zwl on 2018/2/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentInsureRelDAO.js');

function addTruckAccidentInsureRel(params,callback){
    var query = " insert into truck_accident_insure_rel (accident_insure_id,accident_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.accidentInsureId;
    paramsArray[i]=params.accidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccidentInsureRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccidentInsureRel : addTruckAccidentInsureRel
}