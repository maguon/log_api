/**
 * Created by zwl on 2018/4/16.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDAO.js');

function addDriveSalary(params,callback){
    var query = " insert into drive_salary (month_date_id,drive_id,truck_id,load_distance,no_load_distance,plan_salary)  " +
        " values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.loadDistance;
    paramsArray[i++]=params.noLoadDistance;
    paramsArray[i++]=params.planSalary;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalary ');
        return callback(error,rows);
    });
}

function getDriveSalary(params,callback) {
    var query = " select ds.id,ds.month_date_id,ds.load_distance,ds.no_load_distance,ds.plan_salary,ds.other_fee,ds.actual_salary,ds.grant_status, " +
        " d.id as drive_id,d.drive_name,d.tel,c.company_name,c.operate_type,t.id as truck_id,t.truck_num,t.truck_type,tb.brand_name,h.number " +
        " from drive_info d " +
        " left join drive_salary ds on d.id = ds.drive_id " +
        " left join company_info c on d.company_id = c.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join truck_info h on t.rel_id = h.id " +
        " where d.id is not null  ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and ds.id = ? ";
    }
    if(params.monthDateId){
        paramsArray[i++] = params.monthDateId;
        query = query + " and (ds.month_date_id is null or ds.month_date_id = ? )";
    }else{
        query = query + " and ds.month_date_id is not  null ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
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
    query = query + ' order by ds.month_date_id desc ';
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
    addDriveSalary : addDriveSalary,
    getDriveSalary : getDriveSalary,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus
}