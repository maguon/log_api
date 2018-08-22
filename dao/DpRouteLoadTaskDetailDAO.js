/**
 * Created by zwl on 2017/8/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetailDAO.js');

function addDpRouteLoadTaskDetail(params,callback){
    var query = " insert into dp_route_load_task_detail (dp_route_task_id,dp_route_load_task_id,car_id,vin) values (  ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.vin;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskDetail(params,callback) {
    var query = " select dpdtl.*,c.make_id,c.make_name,e.short_name, " +
        " dprl.route_end_id,c1.city_name as route_end_name,r.short_name as receive_name,dprl.transfer_flag, " +
        " dprl.transfer_city_id,c2.city_name as transfer_city_name,dprl.transfer_addr_id,ba.addr_name as transfer_addr_name, " +
        " dprl.load_task_status,cer.exception_status " +
        " from dp_route_load_task_detail dpdtl " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join car_exception_rel cer on dpdtl.car_id = cer.car_id " +
        " left join city_info c1 on dprl.route_end_id = c1.id " +
        " left join receive_info r on dprl.receive_id = r.id " +
        " left join city_info c2 on dprl.transfer_city_id = c2.id " +
        " left join base_addr ba on dprl.transfer_addr_id = ba.id " +
        " where dpdtl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskDetailId){
        paramsArray[i++] = params.dpRouteTaskDetailId;
        query = query + " and dpdtl.id = ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpdtl.dp_route_load_task_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    query = query + ' order by dpdtl.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskDetailBase(params,callback) {
    var query = " select dpdtl.*,dprl.route_start_id,dprl.route_end_id,dprl.receive_id " +
        " from dp_route_load_task_detail dpdtl " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " where dpdtl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskDetailId){
        paramsArray[i++] = params.dpRouteTaskDetailId;
        query = query + " and dpdtl.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and dpdtl.vin like '%"+params.vinCode+"%'";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and dpdtl.car_id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskDetailBase ');
        return callback(error,rows);
    });
}

function getCarLoadStatusCount(params,callback) {
    var query = " select count(dpdtl.id) arrive_count from dp_route_load_task_detail dpdtl " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " where dpdtl.id is not null ";
    var paramsArray=[],i=0;
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    if(params.arriveDateStart){
        paramsArray[i++] = params.arriveDateStart +" 00:00:00";
        query = query + " and dpdtl.arrive_date >= ? ";
    }
    if(params.arriveDateEnd){
        paramsArray[i++] = params.arriveDateEnd +" 23:59:59";
        query = query + " and dpdtl.arrive_date <= ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpdtl.dp_route_load_task_id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarLoadStatusCount ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskDetailStatus(params,callback){
    var query = " update dp_route_load_task_detail set car_load_status = ?, " +
        " arrive_date = ?, date_id = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.carLoadStatus;
    paramsArray[i++] = params.arriveDate;
    paramsArray[i++] = params.dateId;
    paramsArray[i] = params.dpRouteTaskDetailId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskDetailStatus ');
        return callback(error,rows);
    });
}

function deleteDpRouteLoadTaskDetail(params,callback){
    var query = " delete from dp_route_load_task_detail where id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.dpRouteTaskDetailId;
    paramsArray[i] = params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskDetail : addDpRouteLoadTaskDetail,
    getDpRouteLoadTaskDetail : getDpRouteLoadTaskDetail,
    getDpRouteLoadTaskDetailBase : getDpRouteLoadTaskDetailBase,
    getCarLoadStatusCount : getCarLoadStatusCount,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus,
    deleteDpRouteLoadTaskDetail : deleteDpRouteLoadTaskDetail
}