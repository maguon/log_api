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
    var query = " select ds.id,ds.month_date_id,ds.load_distance,ds.no_load_distance,ds.plan_salary,ds.refund_fee,ds.social_security_fee,ds.other_fee,ds.actual_salary,ds.remark,ds.grant_status, " +
        " d.id as drive_id,d.drive_name,u.mobile,c.company_name,c.operate_type,t.id as truck_id,t.truck_num,t.truck_type,tb.brand_name,h.number," +
        " drtm.distance_salary,drtm.reverse_salary,dprm.enter_fee " +
        " from drive_info d left join " +
        " (select * from drive_salary where month_date_id ="+params.monthDateId+") as ds on d.id = ds.drive_id " +
        " left join company_info c on d.company_id = c.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join truck_info h on t.rel_id = h.id " +
        " left join user_info u on d.user_id = u.uid " +
        " left join (select drt.drive_id, " +
        " sum( case " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count<3 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=4 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=5 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count=6 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=6 and drt.car_count>7 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count<5 then drt.distance*0.6 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=5 then drt.distance*0.7 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=6 then drt.distance*0.8 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=7 then drt.distance*0.9 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=8 then drt.distance " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=9 then drt.distance*1.1 " +
        " when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count>10 then drt.distance*1.2 " +
        " end) distance_salary, " +
        " sum(case when drt.reverse_flag=1 then drt.reverse_money end) reverse_salary" +
        " from dp_route_task drt " +
        " where drt.task_plan_date>="+params.monthDateId+"01 and drt.task_plan_date<="+params.monthDateId+"31 and drt.task_status>=9 " +
        " group by drt.drive_id) drtm on d.id = drtm.drive_id " +
        " left join (select dpr.drive_id, " +
        " sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dpr.car_count end)*4 as enter_fee " +
        " from dp_route_task dpr " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " where dpr.task_plan_date>="+params.monthDateId+"01 and dpr.task_plan_date<="+params.monthDateId+"31 and dpr.task_status>=9" +
        " group by dpr.drive_id) dprm on d.id = dprm.drive_id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and ds.id = ? ";
    }
    if(params.grantStatus){
        if(params.grantStatus ==1){
            query = query + " and ds.grant_status is null ";
        }else{
            paramsArray[i++] = params.grantStatus;
            query = query + " and ds.grant_status = ? ";
        }
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

function getDriveSalaryBase(params,callback) {
    var query = " select ds.*,d.drive_name,t.truck_num " +
        " from drive_salary ds " +
        " left join drive_info d on ds.drive_id = d.id " +
        " left join truck_info t on ds.truck_id = t.id " +
        " where ds.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and ds.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and ds.drive_id = ? ";
    }
    if(params.grantStatus){
        paramsArray[i++] = params.grantStatus;
        query = query + " and ds.grant_status = ? ";
    }
    query = query + ' order by ds.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryBase ');
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
    var query = " update drive_salary set refund_fee = ? , social_security_fee = ? , other_fee = ? , actual_salary = ? , remark = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.refundFee;
    paramsArray[i++] = params.socialSecurityFee;
    paramsArray[i++] = params.otherFee;
    paramsArray[i++] = params.actualSalary;
    paramsArray[i++] = params.remark;
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
    getDriveSalaryBase : getDriveSalaryBase,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus
}