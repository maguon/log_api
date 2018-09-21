/**
 * Created by zwl on 2018/6/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverDAO.js');

function addSettleHandover(params,callback){
    var query = " insert into settle_handover_info (number,serial_number,entrust_id,op_user_id,received_date,date_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.serialNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.receivedDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandover ');
        return callback(error,rows);
    });
}

function getSettleHandover(params,callback) {
    var query = " select sh.*,e.short_name,u.real_name as op_user_name," +
        " c1.city_name as city_route_start,c2.city_name as city_route_end,r.short_name as r_short_name " +
        " from settle_handover_info sh " +
        " left join entrust_info e on sh.entrust_id = e.id " +
        " left join user_info u on sh.op_user_id = u.uid " +
        " left join settle_handover_car_rel shcr on sh.id = shcr.settle_handover_id " +
        " left join car_info c on shcr.car_id = c.id " +
        " left join city_info c1 on sh.route_start_id = c1.id " +
        " left join city_info c2 on sh.route_end_id = c2.id "+
        " left join receive_info r on sh.receive_id = r.id "+
        " where sh.id is not null ";
    var paramsArray=[],i=0;
    if(params.settleHandoverId){
        paramsArray[i++] = params.settleHandoverId;
        query = query + " and sh.id = ? ";
    }
    if(params.serialNumber){
        paramsArray[i++] = params.serialNumber;
        query = query + " and sh.serial_number = ? ";
    }
    if(params.opUserId){
        paramsArray[i++] = params.opUserId;
        query = query + " and sh.op_user_id = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and sh.number = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sh.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sh.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sh.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and sh.receive_id = ? ";
    }
    if(params.receivedDateStart){
        paramsArray[i++] = params.receivedDateStart +" 00:00:00";
        query = query + " and sh.received_date >= ? ";
    }
    if(params.receivedDateEnd){
        paramsArray[i++] = params.receivedDateEnd +" 23:59:59";
        query = query + " and sh.received_date <= ? ";
    }
    query = query + ' group by sh.id ';
    query = query + ' order by sh.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandover ');
        return callback(error,rows);
    });
}

function getSettleHandoverBase(params,callback) {
    var query = " select sh.number,sh.serial_number,e.short_name,c1.city_name as city_route_start,c2.city_name as city_route_end, " +
        " r.short_name as r_short_name,c.vin,sh.received_date,u.real_name as op_user_name,sh.remark " +
        " from settle_handover_info sh " +
        " left join settle_handover_car_rel shcr on sh.id = shcr.settle_handover_id " +
        " left join entrust_info e on sh.entrust_id = e.id " +
        " left join receive_info r on sh.receive_id = r.id " +
        " left join user_info u on sh.op_user_id = u.uid " +
        " left join car_info c on shcr.car_id = c.id " +
        " left join city_info c1 on sh.route_start_id = c1.id " +
        " left join city_info c2 on sh.route_end_id = c2.id " +
        " where sh.id is not null ";
    var paramsArray=[],i=0;
    if(params.serialNumber){
        paramsArray[i++] = params.serialNumber;
        query = query + " and sh.serial_number = ? ";
    }
    if(params.opUserId){
        paramsArray[i++] = params.opUserId;
        query = query + " and sh.op_user_id = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and sh.number = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sh.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sh.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sh.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and sh.receive_id = ? ";
    }
    if(params.receivedDateStart){
        paramsArray[i++] = params.receivedDateStart +" 00:00:00";
        query = query + " and sh.received_date >= ? ";
    }
    if(params.receivedDateEnd){
        paramsArray[i++] = params.receivedDateEnd +" 23:59:59";
        query = query + " and sh.received_date <= ? ";
    }
    query = query + ' order by sh.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandoverBase ');
        return callback(error,rows);
    });
}

function getNotSettleHandover(params,callback) {
    var query = " select dpdtl.*,c.make_name,e.short_name as e_short_name, " +
        " dpd.route_start,dpd.route_end,r.short_name as r_short_name, " +
        " d.drive_name,t.truck_num,dpr.task_plan_date " +
        " from dp_route_load_task_detail dpdtl " +
        " left join settle_handover_car_rel shcr on dpdtl.car_id = shcr.car_id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join dp_route_task dpr on dpdtl.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join receive_info r on dprl.receive_id = r.id " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " where shcr.car_id is null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskDetailId){
        paramsArray[i++] = params.dpRouteTaskDetailId;
        query = query + " and dpdtl.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpr.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpdtl.dp_route_task_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    if(params.transferFlag){
        paramsArray[i++] = params.transferFlag;
        query = query + " and dprl.transfer_flag = ? ";
    }
    query = query + ' group by dpdtl.id ';
    query = query + ' order by dpdtl.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getNotSettleHandover ');
        return callback(error,rows);
    });
}

function getNotSettleHandoverCarCount(params,callback) {
    var query = " select count(dpdtl.id) as car_count from dp_route_load_task_detail dpdtl " +
        " left join settle_handover_car_rel shcr on dpdtl.car_id = shcr.car_id " +
        " where shcr.car_id is null ";
    var paramsArray=[],i=0;
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getNotSettleHandoverCarCount ');
        return callback(error,rows);
    });
}

function getSettleHandoverDayCount(params,callback) {
    var query = " select db.id,count(sh.id) as settle_handover_count,if(isnull(sum(sh.car_count)),0,sum(sh.car_count)) as car_count " +
        " from date_base db " +
        " left join settle_handover_info sh on db.id = sh.date_id " +
        " where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and db.id = ? ";
    }
    query = query + ' group by db.id ';
    query = query + ' order by db.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandoverDayCount ');
        return callback(error,rows);
    });
}

function getSettleHandoverMonthCount(params,callback) {
    var query = " select db.y_month,count(sh.id) as settle_handover_count,if(isnull(sum(sh.car_count)),0,sum(sh.car_count)) as car_count " +
        " from date_base db " +
        " left join settle_handover_info sh on db.id = sh.date_id " +
        " where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
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
        logger.debug(' getSettleHandoverMonthCount ');
        return callback(error,rows);
    });
}

function getDriveSettle(params,callback) {
    var query = " select d.id,d.drive_name,cp.operate_type,cp.id as company_id,cp.company_name,t.id as truck_id,t.truck_num, " +
        " count(dpdtl.id) as car_count,sum(ecrr.fee)as value_total from drive_info d " +
        " left join company_info cp on d.company_id = cp.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join dp_route_task dpr on t.id = dpr.truck_id " +
        " left join dp_route_load_task_detail dpdtl on dpr.id = dpdtl.dp_route_task_id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join city_route_info cr on c.route_id = cr.route_id " +
        " left join entrust_city_route_rel ecrr on cr.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id " +
        " where d.id is not null";
    var paramsArray=[],i=0;
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and t.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and cp.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and d.company_id = ? ";
    }
    query = query + ' group by d.id,t.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSettle ');
        return callback(error,rows);
    });
}

function getDriveCost(params,callback) {
    if(params.dateStart&&params.dateEnd){
        var query = " select d.id,d.drive_name, " +
            " (select sum(actual_price) from dp_route_load_task_clean_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")actual_price, " +
            " (select sum(actual_guard_fee) from dp_route_load_task_clean_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")actual_guard_fee, " +
            " (select sum(case when task_loan_status = 2 then grant_actual_money end) from dp_route_task_loan where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")grant_actual_money, " +
            " (select sum(repair_money) from truck_repair_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")repair_money, " +
            " (select sum(fine_money) from drive_peccancy where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")peccancy_fine_money, " +
            " (select sum(exceed_oil_money) from drive_exceed_oil left join dp_route_task on drive_exceed_oil.dp_route_task_id = dp_route_task.id " +
            " where dp_route_task.drive_id=d.id and drive_exceed_oil.date_id>="+params.dateStart+" and drive_exceed_oil.date_id<="+params.dateEnd+")exceed_oil_money from drive_info d " +
            " where d.id is not null ";
    }else{
        var query = " select d.id,d.drive_name, " +
            " (select sum(actual_price) from dp_route_load_task_clean_rel where drive_id=d.id)actual_price, " +
            " (select sum(actual_guard_fee) from dp_route_load_task_clean_rel where drive_id=d.id)actual_guard_fee, " +
            " (select sum(case when task_loan_status = 2 then grant_actual_money end) from dp_route_task_loan where drive_id=d.id)grant_actual_money, " +
            " (select sum(repair_money) from truck_repair_rel where drive_id=d.id)repair_money, " +
            " (select sum(fine_money) from drive_peccancy where drive_id=d.id)peccancy_fine_money, " +
            " (select sum(exceed_oil_money) from drive_exceed_oil left join dp_route_task on drive_exceed_oil.dp_route_task_id = dp_route_task.id " +
            " where dp_route_task.drive_id=d.id)exceed_oil_money from drive_info d " +
            " where d.id is not null ";
    }
    var paramsArray=[],i=0;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    query = query + ' group by d.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveCost ');
        return callback(error,rows);
    });
}

function updateSettleHandover(params,callback){
    var query = " update settle_handover_info set serial_number = ? , received_date = ? , date_id = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.serialNumber;
    paramsArray[i++]=params.receivedDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleHandover ');
        return callback(error,rows);
    });
}

function updateSettleHandoverRoute(params,callback){
    var query = " update settle_handover_info set route_start_id = ?,route_end_id = ?,receive_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleHandoverRoute ');
        return callback(error,rows);
    });
}

function updateCarCountPlus(params,callback){
    var query = " update settle_handover_info set car_count = car_count +1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarCountPlus ');
        return callback(error,rows);
    });
}

function updateCarCountMinus(params,callback){
    var query = " update settle_handover_info set car_count = car_count -1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarCountMinus ');
        return callback(error,rows);
    });
}

function updateHandoveImage(params,callback){
    var query = " update settle_handover_info set handove_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.handoveImage;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateHandoveImage ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleHandover : addSettleHandover,
    getSettleHandover : getSettleHandover,
    getSettleHandoverBase : getSettleHandoverBase,
    getNotSettleHandover : getNotSettleHandover,
    getNotSettleHandoverCarCount : getNotSettleHandoverCarCount,
    getSettleHandoverDayCount : getSettleHandoverDayCount,
    getSettleHandoverMonthCount : getSettleHandoverMonthCount,
    getDriveSettle : getDriveSettle,
    getDriveCost : getDriveCost,
    updateSettleHandover : updateSettleHandover,
    updateSettleHandoverRoute : updateSettleHandoverRoute,
    updateCarCountPlus : updateCarCountPlus,
    updateCarCountMinus : updateCarCountMinus,
    updateHandoveImage : updateHandoveImage
}