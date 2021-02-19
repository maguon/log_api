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

function addSettleHandoverAll(params,callback){
    var query = " insert into settle_handover_info (number,serial_number,entrust_id,op_user_id,received_date," +
        "route_start_id,route_end_id,receive_id,car_count,remark,date_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.serialNumber;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.receivedDate;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.carCount;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandoverAll ');
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
    var query = " select dpdtl.*,c.make_name,e.id as entrust_id,e.short_name as e_short_name, " +
        " dpd.route_start_id,dpd.route_start,dpd.route_end_id,dpd.route_end," +
        " r.id as receive_id,r.short_name as r_short_name,dprl.addr_name, " +
        " d.drive_name,t.truck_num,dpr.task_plan_date, " +params.handoverFlag+" as handover_flag,shcr.sequence_num "+
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
        " where dpdtl.car_id is not null ";
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
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
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
    if(params.handoverFlag) {
        if (params.handoverFlag == 1) {
            query = query + " and shcr.car_id is null ";
        } else {
            query = query + " and shcr.car_id is not null ";
        }
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
    var query = " select count(dpdtl.id) as car_count " +
        " from dp_route_load_task_detail dpdtl " +
        " left join settle_handover_car_rel shcr on dpdtl.car_id = shcr.car_id " +
        " left join dp_route_task dpr on dpdtl.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " where shcr.car_id is null ";
    var paramsArray=[],i=0;
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
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
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
    if(params.handoverFlag) {
        if (params.handoverFlag == 1) {
            query = query + " and shcr.car_id is null ";
        } else {
            query = query + " and shcr.car_id is not null ";
        }
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
    var query = " select drtm.drive_id,drtm.drive_name,drtm.truck_id,drtm.truck_num,drtm.operate_type,drtm.company_name, " +
        " drtm.distance_salary,drtm.reverse_salary,dprm.storage_car_count,dprm.not_storage_car_count,dprtm.output,dprtm.two_output " +
        " from (select  drt.drive_id,d.drive_name,drt.truck_id,t.truck_num,t.operate_type,d.company_id,c.company_name, " +
        " sum( case " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count<=3 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=4 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=5 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=6 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count>=7 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count<5 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=5 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=6 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=7 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=8 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count>=9 then drt.distance*1.4 " +
        " end) distance_salary, " +
        " sum(case when drt.reverse_flag=1 then drt.reverse_money end) reverse_salary" +
        " from dp_route_task drt " +
        " left join drive_info d on drt.drive_id = d.id " +
        " left join truck_info t on drt.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where drt.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' and drt.task_plan_date<='"+params.taskPlanDateEnd+" 23:59:59' and drt.task_status>=9 " +
        " group by drt.drive_id,drt.truck_id) drtm " +
        " left join (select dpr.drive_id,dpr.truck_id, " +
        " sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dprl.real_count end) not_storage_car_count, " +
        " sum( case when dprl.receive_flag=1 or dprl.transfer_flag=1 then dprl.real_count end) storage_car_count " +
        " from dp_route_task dpr " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " where dpr.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' and dpr.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and dpr.task_status>=9 " +
        " group by dpr.drive_id,dpr.truck_id) dprm on drtm.drive_id = dprm.drive_id and drtm.truck_id = dprm.truck_id " +
        " left join (select dprt.drive_id,dprt.truck_id,sum(ecrr.fee*ecrr.distance*drlt.output_ratio) output," +
        " sum(ecrr.two_fee*ecrr.two_distance*drlt.output_ratio) two_output " +
        " from dp_route_load_task_detail drltd " +
        " left join dp_route_load_task drlt on drlt.id = drltd.dp_route_load_task_id " +
        " left join dp_route_task dprt on drltd.dp_route_task_id = dprt.id " +
        " left join car_info ci on drltd.car_id = ci.id " +
        " left join entrust_city_route_rel ecrr on ci.entrust_id = ecrr.entrust_id and " +
        " ci.make_id = ecrr.make_id and ci.route_start_id = ecrr.route_start_id and ci.route_end_id = ecrr.route_end_id and ci.size_type =ecrr.size_type " +
        " where dprt.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' and dprt.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and dprt.task_status>=9 " +
        " group by dprt.drive_id,dprt.truck_id) dprtm on drtm.drive_id = dprtm.drive_id and drtm.truck_id = dprtm.truck_id " +
        " where drtm.drive_id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drtm.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and drtm.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and drtm.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and drtm.company_id = ? ";
    }
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
//工资
function getDriveSettleSalary(params,callback) {
    var query = " select drtm.drive_id,drtm.drive_name,drtm.truck_id,drtm.truck_num,drtm.operate_type,drtm.company_name, " +
        " drtm.distance_salary,drtm.reverse_salary,dprm.storage_car_count,dprm.not_storage_car_count " +
        " from (select  drt.drive_id,d.drive_name,drt.truck_id,t.truck_num,t.operate_type,d.company_id,c.company_name, " +
        " sum( case " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count<=3 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=4 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=5 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=6 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count>=7 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count<5 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=5 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=6 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=7 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=8 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count>=9 then drt.distance*1.4 " +
        " end) distance_salary, " +
        " sum(case when drt.reverse_flag=1 then drt.reverse_money end) reverse_salary" +
        " from dp_route_task drt " +
        " left join drive_info d on drt.drive_id = d.id " +
        " left join truck_info t on drt.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where drt.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' and drt.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and drt.task_status>=9 " +
        " group by drt.drive_id,drt.truck_id) drtm " +
        " left join (select dpr.drive_id,dpr.truck_id, " +
        " sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dprl.real_count end) not_storage_car_count, " +
        " sum( case when dprl.receive_flag=1 or dprl.transfer_flag=1 then dprl.real_count end) storage_car_count " +
        " from dp_route_load_task dprl " +
        " left join dp_route_task dpr on dpr.id = dprl.dp_route_task_id " +
        " where dpr.task_plan_date>= ' "+params.taskPlanDateStart+" 00:00:00'and dpr.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and dpr.task_status>=9 " +
        " group by dpr.drive_id,dpr.truck_id) dprm on drtm.drive_id = dprm.drive_id and drtm.truck_id = dprm.truck_id " +
        " where drtm.drive_id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drtm.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and drtm.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and drtm.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and drtm.company_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSettleSalary ');
        return callback(error,rows);
    });
}
//产值
function getDriveSettleOutput(params,callback) {
    var query = " select drtm.drive_id,drtm.drive_name,drtm.truck_id,drtm.truck_num,drtm.operate_type,drtm.company_name, " +
        " dprtm.output,dprtm.two_output " +
        " from (select  drt.drive_id,d.drive_name,drt.truck_id,t.truck_num,t.operate_type,d.company_id,c.company_name " +
        " from dp_route_task drt " +
        " left join drive_info d on drt.drive_id = d.id " +
        " left join truck_info t on drt.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where drt.task_plan_date>= ' "+params.taskPlanDateStart+" 00:00:00' and drt.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and drt.task_status>=9 " +
        " group by drt.drive_id,drt.truck_id) drtm " +
        " LEFT JOIN ( SELECT dprt.drive_id,dprt.truck_id," +
        " sum( ecrr.fee * ecrr.distance * drlt.output_ratio ) output, " +
        " sum(ecrr.two_fee*ecrr.two_distance*drlt.output_ratio) two_output " +
        " from dp_route_load_task_detail drltd " +
        " left join dp_route_load_task drlt on drlt.id = drltd.dp_route_load_task_id " +
        " left join dp_route_task dprt on drltd.dp_route_task_id = dprt.id " +
        " left join car_info ci on drltd.car_id = ci.id " +
        " left join entrust_city_route_rel ecrr on ci.entrust_id = ecrr.entrust_id and " +
        " ci.make_id = ecrr.make_id and ci.route_start_id = ecrr.route_start_id and ci.route_end_id = ecrr.route_end_id and ci.size_type =ecrr.size_type " +
        " where dprt.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' and dprt.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and dprt.task_status>=9 " +
        " group by dprt.drive_id,dprt.truck_id) dprtm on drtm.drive_id = dprtm.drive_id and drtm.truck_id = dprtm.truck_id " +
        " where drtm.drive_id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drtm.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and drtm.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and drtm.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and drtm.company_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSettleOutput ');
        return callback(error,rows);
    });
}

function getDriveSettleDetail(params,callback) {
    var query = " select dpr.id,dpr.drive_id,d.drive_name,dpr.truck_id,t.truck_num,dpr.task_plan_date,dpr.route_start as dpr_route_start,dpr.route_end as dpr_route_end ," +
        " drltd.car_id,drltd.vin,e.short_name as e_short_name,c.make_name,c.route_start,c.route_end,c.size_type,r.short_name,dprl.output_ratio, " +
        " ecrr.distance,ecrr.fee,(ecrr.fee*ecrr.distance*dprl.output_ratio) output," +
        " (ecrr.two_fee*ecrr.two_distance*dprl.output_ratio) two_output , dprl.receive_flag " +
        " from dp_route_load_task_detail drltd " +
        " left join dp_route_load_task dprl on drltd.dp_route_load_task_id = dprl.id " +
        " left join dp_route_task dpr on drltd.dp_route_task_id = dpr.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join car_info c on drltd.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join entrust_city_route_rel ecrr on c.entrust_id = ecrr.entrust_id " +
        " where dpr.task_plan_date>= '"+params.taskPlanDateStart+" 00:00:00' " +
        " and dpr.task_plan_date<= '"+params.taskPlanDateEnd+" 23:59:59' and dpr.task_status >=9 " +
        " and c.make_id = ecrr.make_id and c.route_start_id = ecrr.route_start_id and c.route_end_id = ecrr.route_end_id " +
        " and c.size_type =ecrr.size_type " ;
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and d.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and d.company_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSettleDetail ');
        return callback(error,rows);
    });
}

function getDriveCost(params,callback) {
    if(params.dateStart&&params.dateEnd){
        var query = " select d.id,d.drive_name, " +
            " (select sum(actual_price) from dp_route_load_task_clean_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")actual_price, " +
            " (select sum(actual_guard_fee) from dp_route_load_task_clean_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")actual_guard_fee, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_passing_cost end) refund_passing_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_fuel_cost end) refund_fuel_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_protect_cost end) refund_protect_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_penalty_cost end) refund_penalty_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_parking_cost end) refund_parking_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_taxi_cost end) refund_taxi_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_hotel_cost end) refund_hotel_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_car_cost end) refund_car_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_enter_cost end) refund_enter_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_run_cost end) refund_run_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_trailer_cost end) refund_trailer_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_repair_cost end) refund_repair_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_care_cost end) refund_care_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_actual_money end) refund_actual_money, " +
            " (select sum(repair_money) from truck_repair_rel where drive_id=d.id and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+")repair_money " +
            " from drive_info d " +
            " left join dp_route_task_loan dprtl on d.id = dprtl.drive_id  and date_id>="+params.dateStart+" and date_id<="+params.dateEnd+
            " where d.id is not null ";
    }else{
        var query = " select d.id,d.drive_name, " +
            " (select sum(actual_price) from dp_route_load_task_clean_rel where drive_id=d.id)actual_price, " +
            " (select sum(actual_guard_fee) from dp_route_load_task_clean_rel where drive_id=d.id)actual_guard_fee, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_passing_cost end) refund_passing_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_fuel_cost end) refund_fuel_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_protect_cost end) refund_protect_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_penalty_cost end) refund_penalty_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_parking_cost end) refund_parking_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_taxi_cost end) refund_taxi_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_hotel_cost end) refund_hotel_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_car_cost end) refund_car_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_enter_cost end) refund_enter_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_run_cost end) refund_run_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_trailer_cost end) refund_trailer_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_repair_cost end) refund_repair_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_care_cost end) refund_care_cost, " +
            " sum(case when task_loan_status = 2 then dprtl.refund_actual_money end) refund_actual_money, " +
            " (select sum(repair_money) from truck_repair_rel where drive_id=d.id)repair_money " +
            " from drive_info d " +
            " left join dp_route_task_loan dprtl on d.id = dprtl.drive_id " +
            " where d.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    query = query + ' group by d.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
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
    addSettleHandoverAll : addSettleHandoverAll,
    getSettleHandover : getSettleHandover,
    getSettleHandoverBase : getSettleHandoverBase,
    getNotSettleHandover : getNotSettleHandover,
    getNotSettleHandoverCarCount : getNotSettleHandoverCarCount,
    getSettleHandoverDayCount : getSettleHandoverDayCount,
    getSettleHandoverMonthCount : getSettleHandoverMonthCount,
    getDriveSettle : getDriveSettle,
    getDriveSettleSalary : getDriveSettleSalary,
    getDriveSettleOutput : getDriveSettleOutput,
    getDriveSettleDetail : getDriveSettleDetail,
    getDriveCost : getDriveCost,
    updateSettleHandover : updateSettleHandover,
    updateSettleHandoverRoute : updateSettleHandoverRoute,
    updateCarCountPlus : updateCarCountPlus,
    updateCarCountMinus : updateCarCountMinus,
    updateHandoveImage : updateHandoveImage
}