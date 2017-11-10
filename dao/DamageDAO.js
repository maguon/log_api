/**
 * Created by zwl on 2017/10/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageDAO.js');

function addDamage(params,callback){
    var query = " insert into damage_info (declare_user_id,car_id,truck_id,truck_num,drive_id,drive_name,date_id,damage_explain) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.damageExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamage ');
        return callback(error,rows);
    });
}

function getDamage(params,callback) {
    var query = " select da.*,u.real_name,u.type,c.vin,c.make_name, " +
        " r.short_name as re_short_name,e.short_name as en_short_name from damage_info da " +
        " left join user_info u on da.declare_user_id = u.uid " +
        " left join car_info c on da.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id where da.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and da.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(da.created_on,'%Y-%m') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(da.created_on,'%Y-%m') <= ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and da.damage_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamage ');
        return callback(error,rows);
    });
}

function updateDamage(params,callback){
    var query = " update damage_info set truck_id = ? , truck_num = ? , drive_id = ? , drive_name = ? , damage_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.damageExplain;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamage ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamage : addDamage,
    getDamage : getDamage,
    updateDamage : updateDamage
}
