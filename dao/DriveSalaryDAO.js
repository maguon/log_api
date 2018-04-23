/**
 * Created by zwl on 2018/4/16.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDAO.js');

function getDriveSalary(params,callback) {
    var query = " select ds.*,d.drive_name,d.tel,c.company_name,c.operate_type,t.truck_num,t.truck_type,tb.brand_name, " +
        " h.number,e.short_name from drive_info d " +
        " left join  drive_salary ds on ds.drive_id = d.id " +
        " left join company_info c on d.company_id = c.id " +
        " left join truck_info t on ds.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join truck_info h on t.rel_id = h.id " +
        " left join entrust_info e on ds.entrust_id = e.id" +
        " where ds.month_date_id = 201804 or ds.month_date_id is null  ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and ds.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and ds.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckBrandId){
        paramsArray[i++] = params.truckBrandId;
        query = query + " and t.brand_id = ? ";
    }
    if(params.grantStatus){
        paramsArray[i++] = params.grantStatus;
        query = query + " and ds.grant_status = ? ";
    }

    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalary ');
        return callback(error,rows);
    });
}

function updateDrivePlanSalary(params,callback){
    var query = " update drive_salary set load_distance = ? , no_load_distance = ? , plan_salary = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.loadDistance;
    paramsArray[i++] = params.noLoadDistance;
    paramsArray[i++] = params.planSalary;
    paramsArray[i] = params.driveSalaryId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrivePlanSalary ');
        return callback(error,rows);
    });
}

function updateDriveActualSalary(params,callback){
    var query = " update drive_salary set other_fee = ? , actual_salary = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.otherFee;
    paramsArray[i++] = params.actualSalary;
    paramsArray[i] = params.driveSalaryId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveActualSalary ');
        return callback(error,rows);
    });
}

function updateDriveSalaryStatus(params,callback){
    var query = " update drive_salary set grant_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.grantStatus;
    paramsArray[i] = params.driveSalaryId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveSalaryStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    getDriveSalary : getDriveSalary,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus
}