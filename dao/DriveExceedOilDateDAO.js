/**
 * Created by zwl on 2019/5/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDateDAO.js');

function addDriveExceedOilDate(params,callback){
    var query = " insert into drive_exceed_oil_date (month_date_id,drive_id,truck_id,plan_oil_total,plan_urea_total, " +
        " actual_oil_total,actual_urea_total,surplus_oil,surplus_urea,subsidy_oil,subsidy_urea,exceed_oil,exceed_urea," +
        " load_oil_distance,no_load_oil_distance,oil_single_price,urea_single_price,actual_money,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.planOilTotal;
    paramsArray[i++]=params.planUreaTotal;
    paramsArray[i++]=params.actualOilTotal;
    paramsArray[i++]=params.actualUreaTotal;
    paramsArray[i++]=params.surplusOil;
    paramsArray[i++]=params.surplusUrea;
    paramsArray[i++]=params.subsidyOil;
    paramsArray[i++]=params.subsidyUrea;
    paramsArray[i++]=params.exceedOil;
    paramsArray[i++]=params.exceedUrea;
    paramsArray[i++]=params.loadOilDistance;
    paramsArray[i++]=params.noLoadOilDistance;
    paramsArray[i++]=params.oilSinglePrice;
    paramsArray[i++]=params.ureaSinglePrice;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function getDriveExceedOilDate(params,callback) {
    var query = " select dprm.drive_id,dprm.drive_name,dprm.truck_id,dprm.truck_num," +
        " dprm.brand_name,dprm.operate_type,dprm.company_id,dprm.company_name,dprm.plan_oil,dprm.plan_urea," +
        " deorm.actual_oil,deorm.actual_urea, " +
        " deodm.id,deodm.month_date_id,deodm.plan_oil_total,deodm.plan_urea_total, " +
        " deodm.actual_oil_total,deodm.actual_urea_total,deodm.surplus_oil,deodm.surplus_urea, " +
        " deodm.subsidy_oil, deodm.subsidy_urea,deodm.exceed_oil,deodm.exceed_urea, " +
        " deodm.actual_money,deodm.check_status,deodm.settle_status,deodm.remark " +
        " from(select dpr.drive_id,d.drive_name,dpr.truck_id,t.truck_num,tb.brand_name,t.operate_type,t.company_id,c.company_name, " +
        " sum(drtor.total_oil) plan_oil,sum(drtor.total_urea) plan_urea " +
        " from dp_route_task dpr " +
        " left join dp_route_task_oil_rel drtor on drtor.dp_route_task_id = dpr.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join company_info c on t.company_id = c.id " +
        " where dpr.task_plan_date>="+params.taskPlanDateStart+" and dpr.task_plan_date<="+params.taskPlanDateEnd+" and dpr.task_status>=9 " +
        " group by dpr.drive_id ,dpr.truck_id) dprm " +

        " left join (select sum(deor.oil) actual_oil, sum(deor.urea) actual_urea, " +
        " deor.drive_id,deor.truck_id " +
        " from drive_exceed_oil_rel deor " +
        " where deor.oil_date>="+params.taskPlanDateStart+" and deor.oil_date<="+params.taskPlanDateStart+
        " group by deor.drive_id ,deor.truck_id) deorm " +
        " on dprm.drive_id = deorm.drive_id and dprm.truck_id = deorm.truck_id " +
        " left join (select deod.id,deod.drive_id,deod.truck_id,deod.month_date_id,deod.plan_oil_total,deod.plan_urea_total," +
        " deod.actual_oil_total,deod.actual_urea_total,deod.surplus_oil,deod.surplus_urea,deod.subsidy_oil, " +
        " deod.subsidy_urea,deod.exceed_oil,deod.exceed_urea,deod.actual_money,deod.check_status,deod.settle_status,deod.remark " +
        " from drive_exceed_oil_date deod where deod.month_date_id = "+params.yMonth+
        " group by deod.drive_id ,deod.truck_id) deodm on dprm.drive_id = deodm.drive_id and dprm.truck_id = deodm.truck_id "+
        " where dprm.drive_id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilDateId){
        paramsArray[i++] = params.exceedOilDateId;
        query = query + " and deodm.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dprm.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dprm.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and dprm.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and dprm.company_id = ? ";
    }
    if(params.checkStatus){
        if(params.checkStatus==1){
            paramsArray[i++] = params.checkStatus;
            query = query + " and deodm.check_status is null ";
        }else{
            paramsArray[i++] = params.checkStatus;
            query = query + " and deodm.check_status = ? ";
        }
    }
    query = query + ' order by dprm.drive_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function getDriveExceedOilMonth(params,callback) {
    var query = " select deod.id,deo.drive_id,d.drive_name,deo.truck_id,t.truck_num,c.company_name,db.y_month, " +
        " sum(deo.plan_oil) as plan_oil,sum(deo.plan_urea) as plan_urea, " +
        " sum(deo.actual_oil) as actual_oil,sum(deo.actual_urea) as actual_urea,deod.actual_money," +
        " deod.settle_status,deod.remark " +
        " from drive_exceed_oil deo " +
        " left join date_base db on deo.date_id = db.id " +
        " left join drive_exceed_oil_date deod on deod.drive_id=deo.drive_id and deod.truck_id = deo.truck_id and deod.month_date_id =db.y_month " +
        " left join drive_info d on deo.drive_id = d.id " +
        " left join truck_info t on deo.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilDateId){
        paramsArray[i++] = params.exceedOilDateId;
        query = query + " and deod.id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deo.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deo.truck_id = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id = ? ";
    }
    query = query + ' group by deo.drive_id,deo.truck_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilMonth ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilDate(params,callback){
    var query = " update drive_exceed_oil_date set plan_oil_total = ? , plan_urea_total = ? , actual_oil_total = ? , actual_urea_total = ? , " +
        " surplus_oil = ? , surplus_urea = ? , subsidy_oil = ? , subsidy_urea = ? , exceed_oil = ? , exceed_urea = ? , " +
        " load_oil_distance = ? , no_load_oil_distance = ? , oil_single_price = ? , urea_single_price = ? , " +
        " actual_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.planOilTotal;
    paramsArray[i++]=params.planUreaTotal;
    paramsArray[i++]=params.actualOilTotal;
    paramsArray[i++]=params.actualUreaTotal;
    paramsArray[i++]=params.surplusOil;
    paramsArray[i++]=params.surplusUrea;
    paramsArray[i++]=params.subsidyOil;
    paramsArray[i++]=params.subsidyUrea;
    paramsArray[i++]=params.exceedOil;
    paramsArray[i++]=params.exceedUrea;
    paramsArray[i++]=params.loadOilDistance;
    paramsArray[i++]=params.noLoadOilDistance;
    paramsArray[i++]=params.oilSinglePrice;
    paramsArray[i++]=params.ureaSinglePrice;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilDateMoney(params,callback){
    var query = " update drive_exceed_oil_date set actual_money = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilDateMoney ');
        return callback(error,rows);
    });
}

function updateExceedOilDateCheckStatus(params,callback){
    var query = " update drive_exceed_oil_date set check_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.checkStatus;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateExceedOilDateCheckStatus ');
        return callback(error,rows);
    });
}


function updateExceedOilDateStatus(params,callback){
    var query = " update drive_exceed_oil_date set settle_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleStatus;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateExceedOilDateStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOilDate : addDriveExceedOilDate,
    getDriveExceedOilDate : getDriveExceedOilDate,
    getDriveExceedOilMonth : getDriveExceedOilMonth,
    updateDriveExceedOilDate : updateDriveExceedOilDate,
    updateDriveExceedOilDateMoney : updateDriveExceedOilDateMoney,
    updateExceedOilDateCheckStatus : updateExceedOilDateCheckStatus,
    updateExceedOilDateStatus : updateExceedOilDateStatus
}
