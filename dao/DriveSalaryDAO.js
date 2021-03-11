/**
 * Created by zwl on 2018/4/16.
 */
var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDAO.js');

function addDriveSalary(params,callback){
    var query = " insert into drive_salary ( " +
        " month_date_id, drive_id, truck_id, company_id, user_id, load_distance, no_load_distance, distance_salary, reverse_salary, enter_fee, " +
        " damage_under_fee, accident_fee, peccancy_under_fee, exceed_oil_fee, damage_retain_fee, damage_op_fee, truck_retain_fee, personal_tax, hotel_bonus, full_work_bonus, other_bonus," +
        " car_oil_fee, truck_parking_fee, car_parking_fee, dp_other_fee, clean_fee, trailer_fee, car_pick_fee, run_fee, lead_fee, " +
        " social_security_fee, food_fee, loan_fee, other_fee, actual_salary, remark " +
        " ) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loadDistance;
    paramsArray[i++]=params.noLoadDistance;
    paramsArray[i++]=params.distanceSalary;
    paramsArray[i++]=params.reverseSalary;
    paramsArray[i++]=params.enterFee;

    paramsArray[i++]=params.damageUnderFee;
    paramsArray[i++]=params.accidentFee;
    paramsArray[i++]=params.peccancyUnderFee;
    paramsArray[i++]=params.exceedOilFee;
    // 质损暂扣款
    paramsArray[i++]=params.damageRetainFee;
    paramsArray[i++]=params.damageOpFee;
    paramsArray[i++]=params.truckRetainFee;
    paramsArray[i++]=params.personalTax;
    paramsArray[i++]=params.hotelBonus;
    paramsArray[i++]=params.fullWorkBonus;
    paramsArray[i++]=params.otherBonus;

    paramsArray[i++]=params.carOilFee;
    paramsArray[i++]=params.truckParkingFee;
    paramsArray[i++]=params.carParkingFee;
    paramsArray[i++]=params.dpOtherFee;
    paramsArray[i++]=params.cleanFee;
    paramsArray[i++]=params.trailerFee;
    paramsArray[i++]=params.carPickFee;
    paramsArray[i++]=params.runFee;
    paramsArray[i++]=params.leadFee;

    paramsArray[i++]=params.socialSecurityFee;
    paramsArray[i++]=params.foodFee;
    paramsArray[i++]=params.loanFee;
    paramsArray[i++]=params.otherFee;
    paramsArray[i++]=params.actualSalary;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalary ');
        return callback(error,rows);
    });
}

function getDriveSalary(params,callback) {
    var query = " select ds.id,ds.month_date_id,ds.truck_id,ds.company_id,ds.user_id,ds.load_distance,ds.no_load_distance," +
        " ds.distance_salary,ds.reverse_salary,ds.enter_fee,ds.damage_under_fee,ds.accident_fee,ds.peccancy_under_fee," +
        " ds.exceed_oil_fee,ds.damage_retain_fee,ds.damage_op_fee,ds.truck_retain_fee,ds.personal_tax,ds.hotel_bonus,ds.full_work_bonus,ds.other_bonus," +
        " ds.car_oil_fee,ds.truck_parking_fee,ds.car_parking_fee,ds.lead_fee,ds.run_fee,ds.car_pick_fee,ds.trailer_fee,ds.clean_fee,ds.dp_other_fee," +
        " ds.social_security_fee,ds.food_fee,ds.loan_fee,ds.other_fee,ds.actual_salary,ds.remark,ds.grant_status," +
        " dprtm.drive_id,dprtm.user_id,dprtm.drive_name,dprtm.mobile, " +
        " t.truck_num,t.truck_type,tb.brand_name,h.number,t.operate_type,c.company_name, " +
        " drtm.distance_salary as plan_distance_salary,drtm.reverse_salary as plan_reverse_salary,dprm.enter_fee as plan_enter_fee " +
        // 主表
        " from(select dprt.drive_id,d.drive_name,d.id,d.user_id,u.mobile " +
        "      from dp_route_task dprt " +
        "      left join drive_info d on dprt.drive_id = d.id " +
        "      left join user_info u on d.user_id = u.uid " +
        "      where dprt.task_plan_date>="+params.monthDateId+"01 and dprt.task_plan_date<="+params.monthDateId+"31 and dprt.task_status>=9 " +
        "      group by dprt.drive_id) dprtm " +
        // 外连
        " left join(select ds.id,ds.month_date_id,ds.drive_id,ds.truck_id,ds.company_id,ds.user_id,ds.load_distance,ds.no_load_distance," +
        "           ds.distance_salary,ds.reverse_salary,ds.enter_fee,ds.damage_under_fee,ds.accident_fee,ds.peccancy_under_fee," +
        "           ds.exceed_oil_fee,ds.damage_retain_fee,ds.damage_op_fee,ds.truck_retain_fee,ds.personal_tax,ds.hotel_bonus,ds.full_work_bonus,ds.other_bonus," +
        "           ds.car_oil_fee,ds.truck_parking_fee,ds.car_parking_fee,ds.lead_fee,ds.run_fee,ds.car_pick_fee,ds.trailer_fee,ds.clean_fee,ds.dp_other_fee," +
        "           ds.social_security_fee,ds.food_fee,ds.loan_fee,ds.other_fee,ds.actual_salary,ds.remark,ds.grant_status" +
        "           from drive_salary ds where ds.month_date_id ="+params.monthDateId+" ) ds on dprtm.drive_id = ds.drive_id " +
        " left join truck_info t on dprtm.id = t.drive_id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join truck_info h on t.rel_id = h.id " +
        " left join company_info c on t.company_id = c.id " +
        " left join (select drt.drive_id, " +
        "               sum( case " +
        "               when drt.reverse_flag=0 and drt.truck_number=6 and then drt.distance*0.8 " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count<5 then drt.distance*0.6 " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=5 then drt.distance*0.7 " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=6 then drt.distance*0.8 " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=7 then drt.distance*0.9 " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count=8 then drt.distance " +
        "               when drt.reverse_flag=0 and drt.truck_number=8 and drt.car_count>=9 then drt.distance*1.4 " +
        "               end) distance_salary, " +
        "               sum(case when drt.reverse_flag=1 then drt.reverse_money end) reverse_salary" +
        "            from dp_route_task drt " +
        "            where drt.task_plan_date>="+params.monthDateId+"01 and drt.task_plan_date<="+params.monthDateId+"31 and drt.task_status>=9 " +
        "            group by drt.drive_id) drtm on dprtm.drive_id = drtm.drive_id " +
        // 外连接
        " left join (select dpr.drive_id, " +
        "           sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dprl.real_count end)*4 as enter_fee " +
        "           from dp_route_load_task dprl " +
        "           left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        "           where dpr.task_plan_date>="+params.monthDateId+"01 and dpr.task_plan_date<="+params.monthDateId+"31 and dpr.task_status>=9" +
        "           group by dpr.drive_id) dprm on dprtm.drive_id = dprm.drive_id " +
        " where dprtm.drive_id is not null ";

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
        query = query + " and dprtm.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and dprtm.drive_name = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckBrandId){
        paramsArray[i++] = params.truckBrandId;
        query = query + " and t.brand_id = ? ";
    }

    query = query + ' order by dprtm.drive_id ';
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
    var query = " select ds.*,d.drive_name,t.id as truck_id,t.truck_num,t.brand_id as truck_brand_id ,tb.brand_name,t.operate_type,c.company_name,ui.mobile " +
        " from drive_salary ds " +
        " left join drive_info d on ds.drive_id = d.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join company_info c on t.company_id = c.id " +
        " left join user_info ui on ui.uid = ds.user_id " +
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
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and ds.month_date_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and ds.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and ds.company_id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ds.user_id = ? ";
    }
    if(params.truckBrandId){
        paramsArray[i++] = params.truckBrandId;
        query = query + " and t.brand_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
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
    var query = " update drive_salary set load_distance = ? , no_load_distance = ?  where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.loadDistance;
    paramsArray[i++] = params.noLoadDistance;
    paramsArray[i] = params.driveSalaryId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrivePlanSalary ');
        return callback(error,rows);
    });
}

function updateDriveActualSalary(params,callback){
    var query = " update drive_salary set social_security_fee = ? , food_fee = ? , loan_fee = ? , " +
        "other_fee = ? , actual_salary = ? , remark = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.socialSecurityFee;
    paramsArray[i++]=params.foodFee;
    paramsArray[i++]=params.loanFee;
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

function updateDriveSalaryPersonalTax(params,callback){
    var query = " update drive_salary set personal_tax = ? , " +
        "actual_salary = IFNULL(distance_salary + reverse_salary + enter_fee " +
        " - damage_under_fee - accident_fee - peccancy_under_fee - exceed_oil_fee " +
        " + full_work_bonus + other_bonus " +
        " - hotel_bonus - social_security_fee - food_fee - loan_fee " +
        " - other_fee - damage_retain_fee - damage_op_fee - truck_retain_fee " +
        " + car_oil_fee + truck_parking_fee + car_parking_fee + dp_other_fee " +
        " + clean_fee  + trailer_fee + run_fee + lead_fee + car_pick_fee " +
        " - personal_tax,0) " +
        " where id is not null ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.personalTax;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i] = params.yMonth;
        query = query + " and month_date_id = ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveSalaryPersonalTax ');
        return callback(error,rows);
    });
}

function updateDriveSalaryEnterFee(params,callback){
    var query = " update drive_salary set enter_fee = 0 where drive_id = ? and month_date_id = ? and grant_status != ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.driveId;
    paramsArray[i++] = params.yMonth;
    paramsArray[i] = 3;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveSalaryEnterFee ');
        return callback(error,rows);
    });
}

module.exports ={
    addDriveSalary : addDriveSalary,
    getDriveSalary : getDriveSalary,
    getDriveSalaryBase : getDriveSalaryBase,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus,
    updateDriveSalaryPersonalTax : updateDriveSalaryPersonalTax,
    updateDriveSalaryEnterFee : updateDriveSalaryEnterFee
};