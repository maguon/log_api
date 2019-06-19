/**
 * Created by zwl on 2019/3/15.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskOilRelDAO.js');

function addDpRouteTaskOilRel(params,callback){
    var query = " insert into dp_route_task_oil_rel(dp_route_task_id,truck_id,drive_id,route_id," +
        " route_start_id,route_start,route_end_id,route_end,oil,total_oil,urea,total_urea,reverse_oil,total_reverse_oil)" +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.routeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.oil;
    paramsArray[i++]=params.totalOil;
    paramsArray[i++]=params.urea;
    paramsArray[i++]=params.totalUrea;
    paramsArray[i++]=params.reverseOil;
    paramsArray[i++]=params.totalReverseOil;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskOilRel ');
        return callback(error,rows);
    });
}

function getDpRouteTaskOilRel(params,callback) {
    var query = " select dpr.id as dp_route_task_id,dpr.truck_id,dpr.drive_id, " +
        " dpr.route_start,dpr.route_end,dpr.task_plan_date,dpr.distance,dpr.load_flag, " +
        " dpr.oil_distance,dpr.oil_load_flag,dpr.car_count,dpr.reverse_flag, " +
        " t.truck_num,t.operate_type,c.company_name,d.drive_name, " +
        " dpror.id,dpror.oil,dpror.total_oil,dpror.urea,dpror.total_urea,dpror.reverse_oil,dpror.total_reverse_oil,dpror.settle_status " +
        " from dp_route_task dpr " +
        " left join dp_route_task_oil_rel dpror on dpror.dp_route_task_id = dpr.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join company_info c on t.company_id = c.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " where dpr.id is not null and dpr.task_status >=9 ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskOilRelId){
        paramsArray[i++] = params.dpRouteTaskOilRelId;
        query = query + " and dpror.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart;
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd;
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and dpror.settle_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskOilRel ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskOilReltotalOil(params,callback){
    var query = " update dp_route_task_oil_rel set oil = ? , total_oil = ? " +
        " where dp_route_task_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.oil;
    paramsArray[i++] = params.totalOil;
    paramsArray[i] = params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskOilReltotalOil ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskOilRelStatus(params,callback){
    var query = " update dp_route_task_oil_rel set settle_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.settleStatus;
    paramsArray[i] = params.dpRouteTaskOilRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskOilRelStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskOilRel : addDpRouteTaskOilRel,
    getDpRouteTaskOilRel : getDpRouteTaskOilRel,
    updateDpRouteTaskOilReltotalOil : updateDpRouteTaskOilReltotalOil,
    updateDpRouteTaskOilRelStatus : updateDpRouteTaskOilRelStatus
}