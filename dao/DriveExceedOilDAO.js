/**
 * Created by zwl on 2018/6/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDAO.js');

function addDriveExceedOil(params,callback){
    var query = " insert into drive_exceed_oil (dp_route_task_id,exceed_oil_quantity,exceed_oil_money,settle_user_id,remark) " +
        " values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.exceedOilQuantity;
    paramsArray[i++]=params.exceedOilMoney;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOil ');
        return callback(error,rows);
    });
}

function getDriveExceedOil(params,callback) {
    var query = " select deo.*,dpr.task_plan_date,dpr.drive_id,d.drive_name,dpr.truck_id,t.truck_num,u.real_name as settle_user_name from drive_exceed_oil deo " +
        " left join dp_route_task dpr on deo.dp_route_task_id = dpr.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join user_info u on deo.settle_user_id = u.uid " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilId){
        paramsArray[i++] = params.exceedOilId;
        query = query + " and deo.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and deo.dp_route_task_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.fineStatus){
        paramsArray[i++] = params.fineStatus;
        query = query + " and deo.fine_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOil ');
        return callback(error,rows);
    });
}

function updateDriveExceedOil(params,callback){
    var query = " update drive_exceed_oil set dp_route_task_id = ? , exceed_oil_quantity = ? , exceed_oil_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.exceedOilQuantity;
    paramsArray[i++]=params.exceedOilMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOil ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOil : addDriveExceedOil,
    getDriveExceedOil : getDriveExceedOil,
    updateDriveExceedOil : updateDriveExceedOil
}
