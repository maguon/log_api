/**
 * Created by zwl on 2017/10/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageDAO.js');

function addDamage(params,callback){
    var query = " insert into damage_info (declare_user_id,car_id,car_model_name,truck_id,truck_num,drive_id,drive_name,date_id,damage_explain) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.carModelName;
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

function addUploadDamage(params,callback){
    var query = " insert into damage_info (declare_user_id,car_id,date_id,damage_explain,upload_id) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.damageExplain;
    paramsArray[i]=params.uploadId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUploadDamage ');
        return callback(error,rows);
    });
}

function getDamage(params,callback) {
    var query = " select da.*,u.real_name as declare_user_name,u.type,u.mobile,c.vin,c.make_id,c.make_name," +
        " c.route_start,ba.addr_name,c.route_end,c.ship_name," +
        " c.order_date,c.receive_id,r.short_name as re_short_name,c.entrust_id,e.short_name as en_short_name," +
        " dc.under_user_id,dc.under_user_name,u2.type as under_user_type,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name," +
        " dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_cost,dc.company_cost,dc.op_user_id," +
        " u3.real_name as op_user_name,dc.date_id as check_end_date,dc.remark,dc.created_on as check_start_date " +
        " from damage_info da " +
        // 2020-02-11 外连接 商品车赔偿打款
        " left join damage_check_indemnity dci on da.id = dci.damage_id " +
        " left join user_info u on da.declare_user_id = u.uid " +
        " left join car_info c on da.car_id = c.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
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
    // 2020-02-11 外连接 商品车赔偿打款
    if(params.indemnityStart){
        paramsArray[i++] = params.indemnityStart;
        query = query + " and dci.date_id >= ? ";
    }
    if(params.indemnityEnd){
        paramsArray[i++] = params.indemnityEnd;
        query = query + " and dci.date_id <= ? ";
    }
    if(params.endDateStart){
        paramsArray[i++] = params.endDateStart;
        query = query + " and dc.date_id >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd;
        query = query + " and dc.date_id <= ? ";
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
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
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
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and da.truck_id = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and da.stat_status = ? ";
    }
    if(params.hangStatus){
        paramsArray[i++] = params.hangStatus;
        query = query + " and da.hang_status = ? ";
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
    var query = " select d.*,c.vin,c.make_name,c.ship_name,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name," +
        " dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_user_name,u2.type as under_user_type,dc.under_cost," +
        " dc.company_cost,rs.repair_station_name,e.short_name as e_short_name,r.short_name as r_short_name " +
        " from damage_info d " +
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

function getDamageInsureRel(params,callback) {
    var query = " select da.*,u.real_name as declare_user_name,u.type,u.mobile,c.vin,c.make_id,c.make_name," +
        " c.route_start,ba.addr_name,c.route_end,c.ship_name,c.order_date,c.receive_id,r.short_name as re_short_name,c.entrust_id,e.short_name as en_short_name," +
        " dc.under_user_id,dc.under_user_name,u2.type as under_user_type,dc.damage_type,dc.damage_link_type,dc.refund_user_id,dc.refund_user_name," +
        " dc.reduction_cost,dc.penalty_cost,dc.profit,dc.repair_id,dc.repair_cost,dc.transport_cost,dc.under_cost,dc.company_cost,dc.op_user_id," +
        " u3.real_name as op_user_name,dc.date_id as check_end_date,dc.remark,dc.created_on as check_start_date, " +
        " di.id as damage_insure_id,di.created_on as insure_created_on,ti.insure_name,u4.real_name as insure_user_name, " +
        " di.insure_plan,di.damage_money,di.insure_actual " +
        // 2019-11-12 外连接 商品车赔偿打款 csv 使用字段
        // 实际打款金额
        " ,dci.actual_money " +
        // 打款说明
        " ,dci.indemnity_explain " +
        // 打款时间
        " ,dci.indemnity_date " +
        // 状态 赔款状态(1-未打款,2-已打款)
        " ,dci.indemnity_status " +
        // 打款账户
        " ,dci.bank_number " +
        // 户名
        " ,dci.bank_user_name " +
        // 开户行
        " ,dci.bank_name " +
        // 开户行号
        " ,dci.bank_id " +
        // 申请打款备注
        " ,dci.apply_explain " +
        // 联系人
        " ,dci.contacts_name " +

        " from damage_info da " +
        // 2019-11-12 外连接 商品车赔偿打款
        " left join damage_check_indemnity dci on da.id = dci.damage_id " +
        " left join user_info u on da.declare_user_id = u.uid " +
        " left join car_info c on da.car_id = c.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join damage_check dc on da.id = dc.damage_id " +
        " left join user_info u2 on dc.under_user_id = u2.uid " +
        " left join user_info u3 on dc.op_user_id = u3.uid " +
        " left join damage_insure_rel dir on da.id = dir.damage_id " +
        " left join damage_insure di on dir.damage_insure_id = di.id " +
        " left join truck_insure ti on di.insure_id = ti.id " +
        " left join user_info u4 on di.insure_user_id = u4.uid " +
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
    // 2020-02-11 外连接 商品车赔偿打款
    if(params.indemnityStart){
        paramsArray[i++] = params.indemnityStart;
        query = query + " and dci.date_id >= ? ";
    }
    if(params.indemnityEnd){
        paramsArray[i++] = params.indemnityEnd;
        query = query + " and dci.date_id <= ? ";
    }
    if(params.endDateStart){
        paramsArray[i++] = params.endDateStart;
        query = query + " and dc.date_id >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd;
        query = query + " and dc.date_id <= ? ";
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
    if(params.hangStatus){
        paramsArray[i++] = params.hangStatus;
        query = query + " and da.hang_status = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart +" 00:00:00";
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd +" 23:59:59";
        query = query + " and c.order_date <= ? ";
    }
    query = query + " order by da.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureRel ');
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
    var query = " update damage_info set truck_id = ? , truck_num = ? , drive_id = ? , drive_name = ? , car_model_name = ? ,damage_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.carModelName;
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
    var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus;
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    query = query + " then d.id end) as damage_count " +
        " from date_base db " +
        " left join damage_info d on db.id = d.date_id " +
        " left join car_info c on d.car_id = c.id " +
        " where db.id is not null ";
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

function getDamageDaseAddrMonthStat(params,callback){
    var query = " select db.y_month,count(case when d.damage_status = "+ params.damageStatus;
    var paramsArray=[],i=0;

    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and c.base_addr_id = ? ";
    }
    query = query + " then d.id end) as damage_count " +
        " from date_base db " +
        " left join damage_info d on db.id = d.date_id " +
        " left join car_info c on d.car_id = c.id " +
        " where db.id is not null ";
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
        logger.debug(' getDamageDaseAddrMonthStat ');
        return callback(error,rows);
    });
}

function getDamageMakeTopMonthStat(params,callback) {
    var query = " select c.make_name,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
        " from damage_info d " +
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

function getDamageDaseAddrTopMonthStat(params,callback) {
    var query = " select ba.addr_name,count(case when d.damage_status = "+ params.damageStatus +" then d.id end) as damage_count " +
        " from damage_info d " +
        " left join date_base db on d.date_id = db.id " +
        " left join car_info c on d.car_id = c.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
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
    query = query + ' group by ba.addr_name ';
    query = query + ' order by damage_count desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageDaseAddrTopMonthStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamage : addDamage,
    addUploadDamage : addUploadDamage,
    getDamage : getDamage,
    getDamageBase : getDamageBase,
    getDamageInsureRel : getDamageInsureRel,
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
    getDamageDaseAddrMonthStat : getDamageDaseAddrMonthStat,
    getDamageMakeTopMonthStat : getDamageMakeTopMonthStat,
    getDamageReceiveTopMonthStat : getDamageReceiveTopMonthStat,
    getDamageDaseAddrTopMonthStat : getDamageDaseAddrTopMonthStat
}
