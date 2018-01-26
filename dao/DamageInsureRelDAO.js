/**
 * Created by zwl on 2018/1/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureRelDAO.js');

function addDamageInsureRel(params,callback){
    var query = " insert into damage_insure_rel (damage_insure_id,damage_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageInsureId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageInsureRel ');
        return callback(error,rows);
    });
}

function deleteDamageInsureRel(params,callback){
    var query = " delete from damage_insure_rel where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.damageInsureRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDamageInsureRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageInsureRel : addDamageInsureRel,
    deleteDamageInsureRel : deleteDamageInsureRel
}

