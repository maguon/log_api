/**
 * Created by zwl on 2017/11/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureDAO.js');

function addDamageInsure(params,callback){
    var query = " insert into damage_insure (insure_id,insure_user_id,insure_plan,insure_actual,date_id) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageInsure ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageInsure : addDamageInsure
}
