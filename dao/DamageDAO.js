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
    var query = " select da.*,u.real_name as declare_user_name,u.type,u.mobile,c.vin,c.make_id,c.make_name,c.receive_id,r.short_name as re_short_name,c.entrust_id,e.short_name as en_short_name, " +
        " dc.under_user_id,dc.under_user_name,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name, " +
        " dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_cost,dc.company_cost,dc.op_user_id, " +
        " u3.real_name as op_user_name,dc.date_id as check_end_date,dc.remark,dc.created_on as check_start_date " +
        " from damage_info da " +
        " left join user_info u on da.declare_user_id = u.uid " +
        " left join car_info c on da.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join damage_check dc on da.id = dc.damage_id " +
        " left join user_info u3 on dc.op_user_id = u3.uid " +
        " where da.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and da.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and da.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and da.created_on <= ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.damageType){
        paramsArray[i++] = params.damageType;
        query = query + " and dc.damage_type = ? ";
    }
    if(params.damageLinkType){
        paramsArray[i++] = params.damageLinkType;
        query = query + " and dc.damage_link_type = ? ";
    }
    if(params.declareUserId){
        paramsArray[i++] = params.declareUserId;
        query = query + " and da.declare_user_id = ? ";
    }
    if(params.declareUserName){
        paramsArray[i++] = params.declareUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.underUserId){
        paramsArray[i++] = params.underUserId;
        query = query + " and dc.under_user_id = ? ";
    }
    if(params.underUserName){
        paramsArray[i++] = params.underUserName;
        query = query + " and u1.real_name = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and da.damage_status = ? ";
    }
    query = query + " order by da.id desc";
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

function getDamageBase(params,callback) {
    var query = " select d.*,c.vin,c.make_name,damage_type,dc.under_user_name, " +
        " e.short_name as e_short_name,r.short_name as r_short_name,dir.id as damage_insure_rel_id from damage_info d " +
        " left join damage_insure_rel dir on d.id = dir.damage_id " +
        " left join damage_insure di on dir.damage_id = di.id " +
        " left join damage_check dc on d.id = dc.damage_id " +
        " left join car_info c on d.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join receive_info r on c.receive_id = r.id where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageInsureId){
        paramsArray[i++] = params.damageInsureId;
        query = query + " and dir.damage_insure_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageBase ');
        return callback(error,rows);
    });
}

function getDamageCheckCount(params,callback) {
    var query = " select count(da.id) as damage_count" ;

    var paramsArray=[],i=0;
    if(params.damageType){
        query = query + " ,dc.damage_type " +"from damage_info da left join damage_check dc on da.id = dc.damage_id where da.id is not null ";
    }
    if(params.damageLinkType){
        query = query + " ,dc.damage_link_type " +"from damage_info da left join damage_check dc on da.id = dc.damage_id where da.id is not null ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and date_format(dc.date_id,'%Y%m') >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and date_format(dc.date_id,'%Y%m') <= ? ";
    }
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and da.damage_status = ? ";
    }
    if(params.damageType){
        query = query + " group by dc.damage_type ";
    }
    if(params.damageLinkType){
        query = query + " group by dc.damage_link_type ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckCount ');
        return callback(error,rows);
    });
}

function getDamageNotCheckCount(params,callback) {
    var query = " select count(da.id) as damage_count,da.damage_status from damage_info da where da.id is not null ";
    var paramsArray=[],i=0;
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and date_format(da.date_id,'%Y%m') >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and date_format(da.date_id,'%Y%m') <= ? ";
    }
    query = query + " group by da.damage_status ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageNotCheckCount ');
        return callback(error,rows);
    });
}

function getDamageTotalCost(params,callback) {
    var query = " select sum(dc.company_cost) as company_cost,sum(dc.under_cost) as under_cost from damage_info da " +
        " left join damage_check dc on da.id = dc.damage_id where da.id is not null ";
    var paramsArray=[],i=0;
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and date_format(dc.date_id,'%Y%m') >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and date_format(dc.date_id,'%Y%m') <= ? ";
    }
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and da.damage_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageTotalCost ');
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

function updateDamageStatus(params,callback){
    var query = " update damage_info set damage_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageStatus;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageStatus ');
        return callback(error,rows);
    });
}

function getDamageMonthStat(params,callback){
    var query = " select count(di.id) d_count ,db.y_month from damage_info di left join date_base db on di.date_id = db.id " +
        "where di.id is not null " ;
    var paramsArray=[],i=0;
    if(params.declareUserId){
        paramsArray[i++] = params.declareUserId;
        query = query + " and di.declare_user_id = ? ";
    }
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
    query = query + " group by db.y_month " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageMonthStat ');
        return callback(error,rows);
    });
}

module.exports ={
    addDamage : addDamage,
    getDamage : getDamage,
    getDamageBase : getDamageBase,
    getDamageCheckCount : getDamageCheckCount,
    getDamageNotCheckCount : getDamageNotCheckCount,
    getDamageTotalCost : getDamageTotalCost,
    updateDamage : updateDamage,
    updateDamageStatus : updateDamageStatus ,
    getDamageMonthStat : getDamageMonthStat
}
