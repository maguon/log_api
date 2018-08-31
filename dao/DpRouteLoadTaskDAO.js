/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDAO.js');

function addDpRouteLoadTask(params,callback){
    var query = " insert into dp_route_load_task (user_id,load_task_type,demand_id,transfer_demand_id, " +
        " dp_route_task_id,route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,date_id," +
        " plan_date,plan_count,transfer_flag,transfer_city_id,transfer_city,transfer_addr_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loadTaskType;
    paramsArray[i++]=params.dpDemandId;
    paramsArray[i++]=params.transferDemandId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.planDate;
    paramsArray[i++]=params.planCount;
    paramsArray[i++]=params.transferFlag;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferCity;
    paramsArray[i++]=params.transferAddrId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTask ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTask(params,callback) {
    var query = " select dprl.*,u.real_name as task_op_name,u1.real_name as field_op_name,ba.addr_name,c.city_name as city_start_name,c1.city_name,r.short_name,r.clean_fee,dpd.pre_count, " +
        " dpr.truck_id,dpr.drive_id,dpr.task_plan_date,dpr.task_start_date,dpr.date_id as task_end_date,t.truck_num,d.drive_name,u2.mobile,count(dpdtl.id) as car_count, " +
        " count(case when cer.exception_status = 1 then cer.id end) as car_exception_count,c2.city_name as transfer_city_name,ba1.addr_name as transfer_addr_name, " +
        " dpd.route_start as demand_route_start,ba2.addr_name as demand_addr_name,dpd.route_end as demand_route_end " +
        " from dp_route_load_task dprl " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " left join user_info u on dprl.user_id = u.uid " +
        " left join user_info u1 on dprl.field_op_id = u1.uid " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task_detail dpdtl on dprl.id = dpdtl.dp_route_load_task_id " +
        " left join car_exception_rel cer on dpdtl.car_id = cer.car_id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
        " left join base_addr ba1 on dprl.transfer_addr_id = ba1.id " +
        " left join city_info c on dprl.route_start_id = c.id " +
        " left join city_info c1 on dprl.route_end_id = c1.id " +
        " left join city_info c2 on dprl.transfer_city_id = c2.id" +
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
    if(params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query = query + " and dprl.load_task_status = ? ";
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
    var query = " select dprl.*,dpr.task_status,c.city_name as route_start_name,ba.addr_name as base_addr_name " +
        " from dp_route_load_task dprl " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " left join city_info c on dprl.route_start_id = c.id " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
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
    if(params.loadTaskStatus == 3){
        var query = " update dp_route_load_task set field_op_id = ? , load_date = ? , real_count = ? , load_task_status = ? where  id = ? ";
    }else if(params.loadTaskStatus == 7){
        var query = " update dp_route_load_task set arrive_date = ? , load_task_status = ? where  id = ? ";
    }else{
        var query = " update dp_route_load_task set load_task_status = ? where  id = ? ";
    }
    var paramsArray=[],i=0;
    if(params.loadTaskStatus == 3){
        paramsArray[i++] = params.userId;
        paramsArray[i++] = params.loadDate;
        paramsArray[i++] = params.realCount;
    }
    if(params.loadTaskStatus == 7){
        paramsArray[i++] = params.arriveDate;
    }
    paramsArray[i++] = params.loadTaskStatus;
    paramsArray[i] = params.dpRouteLoadTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskStatus ');
        return callback(error,rows);
    });
}

function resetLoadTaskTruckCount(params,callback){
    var query = " update truck_dispatch set car_count = " +
        "GREATEST((car_count-(select real_count from dp_route_load_task where id= ? ))  ,0) where truck_id= ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++] = params.dpRouteLoadTaskId;
    paramsArray[i] = params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' resetLoadTaskTruckCount ');
        return callback(error,rows);
    });
}



module.exports ={
    addDpRouteLoadTask : addDpRouteLoadTask,
    getDpRouteLoadTask : getDpRouteLoadTask,
    getDpRouteLoadTaskBase : getDpRouteLoadTaskBase,
    getDpRouteLoadTaskCount : getDpRouteLoadTaskCount,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus ,
    resetLoadTaskTruckCount : resetLoadTaskTruckCount
}
