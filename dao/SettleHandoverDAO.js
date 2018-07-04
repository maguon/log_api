/**
 * Created by zwl on 2018/6/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverDAO.js');

function addSettleHandover(params,callback){
    var query = " insert into settle_handover_info (number,entrust_id,op_user_id,received_date,date_id,remark) values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
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

function getNotSettleHandover(params,callback) {
    var query = " select dpdtl.*,c.make_name,c.model_name,e.short_name as e_short_name, " +
        " c1.city_name as city_route_start,c2.city_name as city_route_end,r.short_name as r_short_name, " +
        " d.drive_name,t.truck_num,dpr.task_plan_date " +
        " from dp_route_load_task_detail dpdtl " +
        " left join settle_handover_car_rel shcr on dpdtl.car_id = shcr.car_id " +
        " left join car_info c on dpdtl.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join dp_route_task dpr on dpdtl.dp_route_task_id = dpr.id " +
        " left join city_info c1 on dpr.route_start_id = c1.id " +
        " left join city_info c2 on dpr.route_end_id = c2.id " +
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

function updateSettleHandover(params,callback){
    var query = " update settle_handover_info set received_date = ? , date_id = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
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
    getNotSettleHandover : getNotSettleHandover,
    getNotSettleHandoverCarCount : getNotSettleHandoverCarCount,
    updateSettleHandover : updateSettleHandover,
    updateSettleHandoverRoute : updateSettleHandoverRoute,
    updateCarCountPlus : updateCarCountPlus,
    updateCarCountMinus : updateCarCountMinus,
    updateHandoveImage : updateHandoveImage
}