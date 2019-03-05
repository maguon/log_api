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
        " dc.under_user_id,dc.under_user_name,u2.type as under_user_type,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name, " +
        " dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_cost,dc.company_cost,dc.op_user_id, " +
        " u3.real_name as op_user_name,dc.date_id as check_end_date,dc.remark,dc.created_on as check_start_date " +
        " from damage_info da " +
        " left join user_info u on da.declare_user_id = u.uid " +
        " left join car_info c on da.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join damage_check dc on da.id = dc.damage_id " +
        " left join user_info u2 on dc.under_user_id = u2.uid " +
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
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
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
        query = query + " and dc.under_user_name = ? ";
    }
    if(params.underUserType){
        paramsArray[i++] = params.underUserType;
        query = query + " and u2.type = ? ";
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
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and da.drive_id = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and da.stat_status = ? ";
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
    var query = " select d.*,c.vin,c.make_name,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name," +
        "dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_user_name,u2.type as under_user_type,dc.under_cost," +
        "dc.company_cost,rs.repair_station_name,e.short_name as e_short_name,r.short_name as r_short_name from damage_info d " +
        " left join damage_insure_rel dir on d.id = dir.damage_id " +
        " left join damage_insure di on dir.damage_id = di.id " +
        " left join damage_check dc on d.id = dc.damage_id " +
        " left join user_info u2 on dc.under_user_id = u2.uid " +
        " left join car_info c on d.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join repair_station_info rs on dc.repair_id = rs.id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and d.id = ? ";
    }
    if(params.damageInsureId){
        paramsArray[i++] = params.damageInsureId;
        query = query + " and dir.damage_insure_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageBase ');
        return callback(error,rows);
    });
}
//web没用
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
    var query = " select db.y_month,count(da.id) as damage_count,da.damage_status " +
        " from damage_info da " +
        " left join date_base db on da.date_id = db.id " +
        " where da.id is not null and da.hang_status = 0 ";
    var paramsArray=[],i=0;
    if(params.declareUserId){
        paramsArray[i++] = params.declareUserId;
        query = query + " and da.declare_user_id = ? ";
    }
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
    query = query + " group by da.damage_status,db.y_month ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageNotCheckCount ');
        return callback(error,rows);
    });
}

function getDamageTotalCost(params,callback) {
    var query = " select db.y_month,sum(dc.company_cost) as company_cost,sum(dc.under_cost) as under_cost from damage_info da " +
        " left join damage_check dc on da.id = dc.damage_id left join date_base db on dc.date_id = db.id where da.id is not null  ";
    var paramsArray=[],i=0;
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and da.damage_status = ? ";
    }
    query = query + " group by db.y_month ";
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

function updateDamageHangStatus(params,callback){
    var query = " update damage_info set hang_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.hangStatus;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageHangStatus ');
        return callback(error,rows);
    });
}

function updateDamageStatStatus(params,callback){
    var query = " update damage_info set stat_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.statStatus;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageStatStatus ');
        return callback(error,rows);
    });
}

function getDamageTypeMonthStat(params,callback){
    if(params.makeId){
        var query = " select db.y_month,dt.id,count(case when di.damage_status = "+params.damageStatus+" and c.make_id ="+params.makeId+" then di.id end) as damage_count " +
            " from date_base db " +
            " inner join damage_type dt " +
            " left join damage_check dc on dt.id = dc.damage_type " +
            " left join damage_info di on dc.damage_id = di.id and db.id = di.date_id " +
            " left join car_info c on di.car_id = c.id " +
            " where db.id is not null ";
    }else{
        var query = " select db.y_month,dt.id,count(case when di.damage_status = "+params.damageStatus+" then di.id end) as damage_count " +
            " from date_base db " +
            " inner join damage_type dt " +
            " left join damage_check dc on dt.id = dc.damage_type " +
            " left join damage_info di on dc.damage_id = di.id and db.id = di.date_id " +
            " left join car_info c on di.car_id = c.id " +
            " where db.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,dt.id ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageTypeMonthStat ');
        return callback(error,rows);
    });
}

function getDamageLinkTypeMonthStat(params,callback){
    var query = " select dc.damage_link_type,count(d.id) as damage_count " +
        " from damage_info d " +
        " left join damage_check dc on d.id = dc.damage_id " +
        " left join car_info c on d.car_id = c.id " +
        " left join date_base db on d.date_id = db.id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageStatus){
        paramsArray[i++] = params.damageStatus;
        query = query + " and d.damage_status = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by dc.damage_link_type ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageLinkTypeMonthStat ');
        return callback(error,rows);
    });
}

function getDamageTypeWeekStat(params,callback){
    if(params.makeId){
        var query = " select db.y_week,dt.id,count(case when di.damage_status = "+params.damageStatus+" and c.make_id = "+params.makeId+" then di.id end) as damage_count " +
            " from date_base db " +
            " inner join damage_type dt " +
            " left join damage_check dc on dt.id = dc.damage_type " +
            " left join damage_info di on dc.damage_id = di.id and db.id = di.date_id " +
            " left join car_info c on di.car_id = c.id " +
            " where db.id is not null ";
    }else{
        var query = " select db.y_week,dt.id,count(case when di.damage_status = "+params.damageStatus+" then di.id end) as damage_count " +
            " from date_base db " +
            " inner join damage_type dt " +
            " left join damage_check dc on dt.id = dc.damage_type " +
            " left join damage_info di on dc.damage_id = di.id and db.id = di.date_id " +
            " left join car_info c on di.car_id = c.id " +
            " where db.id is not null ";
    }
    var paramsArray=[],i=0;
    query = query + ' group by db.y_week,dt.id ';
    query = query + ' order by db.y_week desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageTypeWeekStat ');
        return callback(error,rows);
    });
}

function getDamageMakeMonthStat(params,callback){
    if(params.makeId){
        var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus +" and c.make_id = "+ params.makeId +" then d.id end) as damage_count " +
            " from date_base db " +
            " left join damage_info d on db.id = d.date_id " +
            " left join car_info c on d.car_id = c.id " +
            " where db.id is not null ";
    }else{
        var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
            " from date_base db " +
            " left join damage_info d on db.id = d.date_id " +
            " left join car_info c on d.car_id = c.id " +
            " where db.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageMakeMonthStat ');
        return callback(error,rows);
    });
}

function getDamageReceiveMonthStat(params,callback){
    if(params.routeEndId&&params.receiveId){
        var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus +" and " +
            " c.route_end_id = "+ params.routeEndId +" and c.receive_id = "+ params.receiveId +" then d.id end) as damage_count " +
            " from date_base db " +
            " left join damage_info d on db.id = d.date_id " +
            " left join car_info c on d.car_id = c.id " +
            " where db.id is not null ";
    }else{
        var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
            " from date_base db " +
            " left join damage_info d on db.id = d.date_id " +
            " left join car_info c on d.car_id = c.id " +
            " where db.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageReceiveMonthStat ');
        return callback(error,rows);
    });
}

function getDamageMakeTopMonthStat(params,callback) {
    var query = " select c.make_name,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
        " from damage_info d" +
        " left join date_base db on d.date_id = db.id " +
        " left join car_info c on d.car_id = c.id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by c.make_name ';
    query = query + ' order by damage_count desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageMakeTopMonthStat ');
        return callback(error,rows);
    });
}

function getDamageReceiveTopMonthStat(params,callback) {
    var query = " select r.short_name,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
        " from damage_info d" +
        " left join date_base db on d.date_id = db.id " +
        " left join car_info c on d.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by r.short_name ';
    query = query + ' order by damage_count desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageReceiveTopMonthStat ');
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
    updateDamageStatus : updateDamageStatus,
    updateDamageHangStatus : updateDamageHangStatus,
    updateDamageStatStatus : updateDamageStatStatus,
    getDamageTypeMonthStat : getDamageTypeMonthStat,
    getDamageLinkTypeMonthStat : getDamageLinkTypeMonthStat,
    getDamageTypeWeekStat : getDamageTypeWeekStat,
    getDamageMakeMonthStat : getDamageMakeMonthStat,
    getDamageReceiveMonthStat : getDamageReceiveMonthStat,
    getDamageMakeTopMonthStat : getDamageMakeTopMonthStat,
    getDamageReceiveTopMonthStat : getDamageReceiveTopMonthStat
}
