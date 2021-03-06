/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDispatchDAO.js');

function getTruckDispatch(params,callback) {
    var query = " select td.*,ci.city_name,cs.city_name as task_start_name,ce.city_name as task_end_name, " +
        " h.truck_num,h.hp,h.truck_tel,h.drive_id,h.company_id,h.truck_type, " +
        " d.drive_name,d.level,u.mobile,c.company_name,h.operate_type from truck_dispatch td " +
        " left join city_info ci on td.current_city = ci.id " +
        " left join city_info cs on td.task_start = cs.id " +
        " left join city_info ce on td.task_end = ce.id " +
        " left join truck_info h on td.truck_id = h.id " +
        " left join drive_info d on h.drive_id = d.id " +
        " left join company_info c on h.company_id = c.id " +
        " left join user_info u on d.user_id = u.uid " +
        " where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and td.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.truckNumber){
        paramsArray[i++] = params.truckNumber;
        query = query + " and td.truck_number = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.currentCity){
        paramsArray[i++] = params.currentCity;
        query = query + " and td.current_city = ? ";
    }
    if(params.taskStart){
        paramsArray[i++] = params.taskStart;
        query = query + " and td.task_start = ? ";
    }
    if(params.taskEnd){
        paramsArray[i++] = params.taskEnd;
        query = query + " and td.task_end = ? ";
    }
    if(params.cityTaskStart){
        query = query + " and concat(td.current_city,td.task_start) like '%"+params.cityTaskStart+"%'";

    }
    query = query + ' group by td.truck_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatch ');
        return callback(error,rows);
    });
}

function getTruckDispatchStop(params,callback) {
    var query = " select td.*,ci.city_name,cs.city_name as task_start_name,ce.city_name as task_end_name, " +
        " h.truck_num,h.hp,h.truck_tel,h.drive_id,h.company_id,h.truck_type, " +
        " d.drive_name,u.mobile,c.company_name,c.operate_type from truck_dispatch td " +
        " left join city_info ci on td.current_city = ci.id " +
        " left join city_info cs on td.task_start = cs.id " +
        " left join city_info ce on td.task_end = ce.id " +
        " left join truck_info h on td.truck_id = h.id " +
        " left join drive_info d on h.drive_id = d.id " +
        " left join company_info c on h.company_id = c.id " +
        " left join user_info u on d.user_id = u.uid " +
        " where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and td.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.truckNumber){
        paramsArray[i++] = params.truckNumber;
        query = query + " and td.truck_number = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.currentCity){
        paramsArray[i++] = params.currentCity;
        query = query + " and td.current_city = ? ";
    }
    if(params.taskStart){
        paramsArray[i++] = params.taskStart;
        query = query + " and td.task_start = ? ";
    }
    if(params.taskEnd){
        paramsArray[i++] = params.taskEnd;
        query = query + " and td.task_end = ? ";
    }
    if(params.cityTaskStart){
        query = query + " and concat(td.current_city,td.task_start) like '%"+params.cityTaskStart+"%'";

    }
    query = query + ' group by td.truck_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatchStop ');
        return callback(error,rows);
    });
}

function getTruckDispatchLoadTask(params,callback) {
    var query = " select td.*,ci.city_name,cs.city_name as task_start_name,ce.city_name as task_end_name, " +
        " h.truck_num,h.hp,h.truck_tel,h.drive_id,h.company_id,h.truck_type, " +
        " d.drive_name,u.mobile,c.company_name,c.operate_type from truck_dispatch td " +
        " left join city_info ci on td.current_city = ci.id " +
        " left join city_info cs on td.task_start = cs.id " +
        " left join city_info ce on td.task_end = ce.id " +
        " left join truck_info h on td.truck_id = h.id " +
        " left join drive_info d on h.drive_id = d.id " +
        " left join company_info c on h.company_id = c.id " +
        " left join dp_route_task dpr on td.truck_id = dpr.truck_id " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id" +
        " left join user_info u on d.user_id = u.uid " +
        " where td.truck_id is not null and dpr.task_status <=4 ";
    var paramsArray=[],i=0;
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    if(params.transferCityId){
        paramsArray[i++] = params.transferCityId;
        query = query + " and dprl.transfer_city_id = ? ";
    }
    if(params.transferAddrId){
        paramsArray[i++] = params.transferAddrId;
        query = query + " and dprl.transfer_addr_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and td.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.currentCity){
        paramsArray[i++] = params.currentCity;
        query = query + " and td.current_city = ? ";
    }
    if(params.taskStart){
        paramsArray[i++] = params.taskStart;
        query = query + " and td.task_start = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
    }
    if(params.taskEnd){
        paramsArray[i++] = params.taskEnd;
        query = query + " and td.task_end = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dprl.receive_id = ? ";
    }
    if(params.cityTaskStart){
        query = query + " and concat(td.current_city,td.task_start) like '%"+params.cityTaskStart+"%'";

    }
    query = query + ' group by td.truck_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatchLoadTask ');
        return callback(error,rows);
    });
}

function getTruckDispatchCount(params,callback) {
    var query = " select count(case when td.current_city >0 then td.truck_id end) as ready_accept_count, " +
        " count(case when td.task_start >0 and td.task_end>0 then td.truck_id end) as on_road_count " +
        " from truck_dispatch td " +
        " where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatchCount ');
        return callback(error,rows);
    });
}

function getTruckDispatchOpTypeCount(params,callback) {
    var query = " SELECT td.truck_number, count( * ) as total_count " +
        " FROM truck_dispatch td " +
        " LEFT JOIN truck_info ti ON td.truck_id = ti.id " +
        " where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and ti.operate_type = ? ";
    }
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    query = query + ' group by td.truck_number';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatchOpTypeCount ');
        return callback(error,rows);
    });
}

function getTruckNumberType(params,callback) {
    var query = " select td.truck_number from truck_dispatch td " +
        " where td.truck_id is not null and td.truck_number > 0 ";
    var paramsArray=[],i=0;
    query = query + ' group by td.truck_number ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckNumberType ');
        return callback(error,rows);
    });
}

function getCityTruckDispatchCount(params,callback) {
    var query = " select count(td.truck_id) as truck_id,sum(td.truck_number) as truck_number from truck_dispatch td " +
        " where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    if(params.currentCity){
        paramsArray[i++] = params.currentCity;
        query = query + " and td.current_city = ? ";
    }
    if(params.taskStart){
        paramsArray[i++] = params.taskStart;
        query = query + " and td.task_start = ? ";
    }
    if(params.taskEnd){
        paramsArray[i++] = params.taskEnd;
        query = query + " and td.task_end = ? ";
    }
    if(params.cityTaskStart){
        query = query + " and concat(td.current_city,td.task_start) like '%"+params.cityTaskStart+"%'";

    }
    if(params.truckNumber){
        paramsArray[i++] = params.truckNumber;
        query = query + " and td.truck_number = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityTruckDispatchCount ');
        return callback(error,rows);
    });
}

function updateTruckDispatchCarCount(params,callback){
    if(params.carLoadStatus==2){
        var query = " update truck_dispatch set car_count = car_count - ? where truck_id = ? " ;
    }else{
        var query = " update truck_dispatch set car_count = car_count + ? where truck_id = ? " ;
    }
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carCount;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDispatchCarCount ');
        return callback(error,rows);
    });
}

function updateTruckDispatch(params,callback){
    var query = " update truck_dispatch set current_city = ? , task_start = ? , task_end = ?  " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.currentCity;
    paramsArray[i++]=params.taskStart;
    paramsArray[i++]=params.taskEnd;
    if(params.carCount){
        query = query +" , car_count = ? "
        paramsArray[i++]=params.carCount;
    }
    query = query+" where truck_id = ? ";

    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDispatch ');
        return callback(error,rows);
    });
}

function updateTruckDispatchCurrent(params,callback){
    var query = " update truck_dispatch set current_city = ? , task_start = ? , task_end = ? , car_count = ? " +
        " where truck_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.currentCity;
    paramsArray[i++]=params.taskStart;
    paramsArray[i++]=params.taskEnd;
    paramsArray[i++]=params.carCount;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDispatchCurrent ');
        return callback(error,rows);
    });
}

function updateTruckDispatchNumber (params,callback){
    var query = " update truck_dispatch set truck_number = ? where truck_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNumber;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDispatchNumber ');
        return callback(error,rows);
    });
}


module.exports = {
    getTruckDispatch : getTruckDispatch,
    getTruckDispatchStop : getTruckDispatchStop,
    getTruckDispatchLoadTask : getTruckDispatchLoadTask,
    getTruckDispatchCount : getTruckDispatchCount,
    getTruckDispatchOpTypeCount : getTruckDispatchOpTypeCount,
    getTruckNumberType : getTruckNumberType,
    getCityTruckDispatchCount : getCityTruckDispatchCount,
    updateTruckDispatchCarCount : updateTruckDispatchCarCount,
    updateTruckDispatch : updateTruckDispatch,
    updateTruckDispatchCurrent : updateTruckDispatchCurrent,
    updateTruckDispatchNumber : updateTruckDispatchNumber
}
