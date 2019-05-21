/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDAO.js');

function addDpRouteLoadTask(params,callback){
    var query = " insert into dp_route_load_task (user_id,load_task_type,demand_id,transfer_demand_id, " +
        " dp_route_task_id,route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end," +
        " receive_id,short_name,receive_flag,date_id," +
        " plan_date,plan_count,transfer_flag,transfer_city_id,transfer_city,transfer_addr_id,transfer_addr_name) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loadTaskType;
    paramsArray[i++]=params.dpDemandId;
    paramsArray[i++]=params.transferDemandId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.addrName;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.receiveFlag;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.planDate;
    paramsArray[i++]=params.planCount;
    paramsArray[i++]=params.transferFlag;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferCity;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.transferAddrName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTask ');
        return callback(error,rows);
    });
}

function addDpRouteLoadTaskBatch(params,callback){
    var query = " insert into dp_route_load_task (user_id,load_task_type,demand_id,transfer_demand_id,dp_route_task_id, " +
        " route_start_id,route_start,base_addr_id,addr_name,route_end_id, " +
        " route_end,receive_id,short_name,receive_flag,date_id,plan_date, " +
        " plan_count,transfer_flag,transfer_city_id,transfer_city,transfer_addr_id,transfer_addr_name) " +
        " select dprltmp.user_id,dprltmp.load_task_type,dprltmp.demand_id,dprltmp.transfer_demand_id,"+ params.dpRouteTaskId +", " +
        " dprltmp.route_start_id,dprltmp.route_start,dprltmp.base_addr_id,dprltmp.addr_name,dprltmp.route_end_id, " +
        " dprltmp.route_end,dprltmp.receive_id,dprltmp.short_name,dprltmp.receive_flag,dprltmp.date_id,dprltmp.plan_date, " +
        " dprltmp.plan_count,dprltmp.transfer_flag,dprltmp.transfer_city_id,dprltmp.transfer_city,dprltmp.transfer_addr_id," +
        " dprltmp.transfer_addr_name " +
        " from dp_route_load_task_tmp dprltmp where dprltmp.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskTmpId){
        paramsArray[i++] = params.dpRouteTaskTmpId;
        query = query + " and dprltmp.dp_route_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskBatch ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTask(params,callback) {
    var query = " select dprl.*,dprl.route_start as city_start_name,dprl.route_end as city_name,dprl.transfer_city as transfer_city_name, " +
        " u.real_name as task_op_name,u1.real_name as field_op_name," +
        " dpr.task_status,dpr.truck_id,dpr.drive_id,dpr.task_plan_date,dpr.task_start_date,dpr.date_id as task_end_date, " +
        " t.truck_num,d.drive_name,u2.mobile,count(dpdtl.id) as car_count, " +
        " count(case when c.size_type = 0 then dpdtl.id end) as small_car_count, " +
        " count(case when c.size_type = 1 then dpdtl.id end) as big_car_count, " +
        " sum(e.car_parking_fee) as car_parking_fee, " +
        " r.make_name,r.clean_fee,r.big_clean_fee,r.trailer_fee,r.run_fee,r.lead_fee,r.receive_flag, " +
        " dpd.pre_count,dpd.route_start as demand_route_start,ba2.addr_name as demand_addr_name,dpd.route_end as demand_route_end,dpd.remark as demand_remark " +
        " from dp_route_load_task dprl " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " left join user_info u on dprl.user_id = u.uid " +
        " left join user_info u1 on dprl.field_op_id = u1.uid " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task_detail dpdtl on dprl.id = dpdtl.dp_route_load_task_id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join receive_info r on dprl.receive_id = r.id " +
        " left join user_info u2 on d.user_id = u2.uid " +
        " left join base_addr ba2 on dpd.base_addr_id = ba2.id " +
        " where dprl.load_task_status !=8 and dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.loadTaskType){
        paramsArray[i++] = params.loadTaskType;
        query = query + " and dprl.load_task_type = ? ";
    }
    if(params.dpDemandId){
        paramsArray[i++] = params.dpDemandId;
        query = query + " and dprl.demand_id = ? ";
    }
    if(params.transferDemandId){
        paramsArray[i++] = params.transferDemandId;
        query = query + " and dprl.transfer_demand_id = ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dprl.id = ? ";
    }
    if(params.fieldOpId){
        paramsArray[i++] = params.fieldOpId;
        query = query + " and dprl.field_op_id = ? ";
    }
    if(params.loadDateStart){
        paramsArray[i++] = params.loadDateStart +" 00:00:00";
        query = query + " and dprl.load_date >= ? ";
    }
    if(params.loadDateEnd){
        paramsArray[i++] = params.loadDateEnd +" 23:59:59";
        query = query + " and dprl.load_date <= ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dprl.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dprl.route_end_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dprl.receive_id = ? ";
    }
    if(params.transferCityId){
        paramsArray[i++] = params.transferCityId;
        query = query + " and dprl.transfer_city_id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and dprl.date_id = ? ";
    }
    if(params.loadTaskStatusArr){
        query = query + " and dprl.load_task_status in ("+params.loadTaskStatusArr + ") "
    }
    if(params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query = query + " and dprl.load_task_status = ? ";
    }
    if(params.taskStatusArr){
        query = query + " and dpr.task_status in ("+params.taskStatusArr + ") ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    query = query + ' group by dprl.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTask ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskBase(params,callback) {
    var query = " select dprl.*,dpr.task_status, " +
        " dpd.route_start_id as demand_route_start_id,dpd.route_end_id as demand_route_end_id " +
        " from dp_route_load_task dprl " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " where dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dprl.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query = query + " and dprl.load_task_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskBase ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskList(params,callback) {
    var query = " select c2.distance/c1.distance as output_ratio from city_route_info c1,city_route_info c2, " +
        " (select concat(LEAST(ddi.route_start_id,ddi.route_end_id),GREATEST(ddi.route_start_id,ddi.route_end_id)) as demand_route_id," +
        " concat(LEAST(drlt.route_start_id,drlt.transfer_city_id),GREATEST(drlt.route_start_id,drlt.transfer_city_id)) as load_route_id" +
        " from dp_route_load_task drlt left join dp_demand_info ddi on drlt.demand_id = ddi.id where drlt.id = "+ params.dpRouteLoadTaskId +") drtt " +
        " where c1.route_id= drtt.demand_route_id and c2.route_id = drtt.load_route_id ";
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskList ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCount(params,callback) {
    var query = " select count(dprl.id) as load_number,sum(dprl.real_count) as load_count from dp_route_load_task dprl where dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.fieldOpId){
        paramsArray[i++] = params.fieldOpId;
        query = query + " and dprl.field_op_id = ? ";
    }
    if(params.loadDateStart){
        paramsArray[i++] = params.loadDateStart +" 00:00:00";
        query = query + " and dprl.load_date >= ? ";
    }
    if(params.loadDateEnd){
        paramsArray[i++] = params.loadDateEnd +" 23:59:59";
        query = query + " and dprl.load_date <= ? ";
    }
    if(params.loadTaskStatusArr){
        query = query + " and dprl.load_task_status in ("+params.loadTaskStatusArr+ ") "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCount ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskStatus(params,callback){
    var query = " update dp_route_load_task set load_task_status = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.loadTaskStatus;
    if(params.loadTaskStatus == 1){
        query = query +" ,load_date = ? , real_count = ? ";
        paramsArray[i++] = params.loadDate;
        paramsArray[i++] = params.realCount;
    }
    if(params.loadTaskStatus == 3){
        query = query +" ,field_op_id = ? , load_date = ? , real_count = ? ";
        paramsArray[i++] = params.userId;
        paramsArray[i++] = params.loadDate;
        paramsArray[i++] = params.realCount;
    }
    if(params.loadTaskStatus == 7){
        query = query +" ,arrive_date = ? , output_ratio = ? ";
        paramsArray[i++] = params.arriveDate;
        paramsArray[i++] = params.outputRatio;
    }
    query = query + " where id = " + params.dpRouteLoadTaskId + " and load_task_status != "+params.loadTaskStatus;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTask : addDpRouteLoadTask,
    addDpRouteLoadTaskBatch : addDpRouteLoadTaskBatch,
    getDpRouteLoadTask : getDpRouteLoadTask,
    getDpRouteLoadTaskBase : getDpRouteLoadTaskBase,
    getDpRouteLoadTaskList : getDpRouteLoadTaskList,
    getDpRouteLoadTaskCount : getDpRouteLoadTaskCount,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus
}
