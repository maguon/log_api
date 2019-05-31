/**
 * Created by zwl on 2019/5/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveTruckMonthValueDAO.js');

function addDistance(params,callback){
    var query = " insert into drive_truck_month_value" +
        " (y_month,drive_id,truck_id,reverse_count,load_distance,no_load_distance,distance," +
        " load_oil_distance,no_oil_distance,receive_car_count,storage_car_count) " +
        " select "+params.yMonth+",dpr.drive_id,dpr.truck_id, " +
        " count(case when dpr.reverse_flag = 1 then dpr.id end) as reverse_count, " +
        " sum(case when dpr.load_flag = 1 then dpr.distance end) as load_distance, " +
        " sum(case when dpr.load_flag = 0 then dpr.distance end) as no_load_distance, " +
        " sum(dpr.distance) as distance, " +
        " sum(case when dpr.oil_load_flag = 1 then dpr.oil_distance end) as load_oil_distance, " +
        " sum(case when dpr.oil_load_flag = 0 then dpr.oil_distance end) as no_oil_distance, " +
        " sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dpr.car_count end) not_storage_car_count, " +
        " sum( case when dprl.receive_flag=1 or dprl.transfer_flag=1 then dpr.car_count end) storage_car_count " +
        " from dp_route_task dpr " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " where dpr.task_status >=9 and dpr.task_plan_date>="+params.yMonth+"01 and dpr.task_plan_date<=" +params.yMonth+"31"+
        " group by dpr.drive_id,dpr.truck_id ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDistance ');
        return callback(error,rows);
    });
}

function updateOutput(params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select dprt.drive_id,dprt.truck_id,sum(ecrr.fee*ecrr.distance*drlt.output_ratio) output " +
        " from dp_route_task dprt " +
        " left join dp_route_load_task_detail drltd on drltd.dp_route_task_id = dprt.id " +
        " left join dp_route_load_task drlt on drlt.id = drltd.dp_route_load_task_id " +
        " left join car_info ci on drltd.car_id = ci.id " +
        " left join entrust_city_route_rel ecrr on ci.entrust_id = ecrr.entrust_id " +
        " and ci.make_id = ecrr.make_id and ci.route_id = ecrr.city_route_id " +
        " and ci.size_type =ecrr.size_type  where dprt.task_plan_date>= "+params.yMonth+"01"+
        " and dprt.task_plan_date<="+params.yMonth+"31 and dprt.task_status >=9 " +
        " group by dprt.drive_id,dprt.truck_id) dprm " +
        " on dtmv.drive_id = dprm.drive_id and dtmv.truck_id = dprm.truck_id " +
        " and dtmv.y_month = "+params.yMonth+" set dtmv.output = dprm.output ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateOutput ');
        return callback(error,rows);
    });
}

function updateInsureFee(params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select tir.truck_id,sum(tir.total_money) as insure_fee " +
        " from truck_insure_rel tir " +
        " where tir.date_id >="+params.yMonth+"01 and tir.date_id<= "+params.yMonth+"31 and tir.insure_status = 1"+
        " group by tir.truck_id) tirm " +
        " on dtmv.truck_id = tirm.truck_id " +
        " and dtmv.y_month = "+params.yMonth+" set dtmv.insure_fee = tirm.insure_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateInsureFee ');
        return callback(error,rows);
    });
}

function updateDistanceSalary(params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select dpr.drive_id,dpr.truck_id, " +
        " sum( case " +
        " when dpr.reverse_flag=0 and dpr.truck_number=6 and dpr.car_count<3 then dpr.distance*0.6 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=6 and dpr.car_count=4 then dpr.distance*0.7 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=6 and dpr.car_count=5 then dpr.distance*0.8 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=6 and dpr.car_count=6 then dpr.distance*0.9 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=6 and dpr.car_count>7 then dpr.distance " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count<5 then dpr.distance*0.6 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count=5 then dpr.distance*0.7 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count=6 then dpr.distance*0.8 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count=7 then dpr.distance*0.9 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count=8 then dpr.distance " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count=9 then dpr.distance*1.1 " +
        " when dpr.reverse_flag=0 and dpr.truck_number=8 and dpr.car_count>10 then dpr.distance*1.2 " +
        " end) distance_salary, " +
        " sum(case when dpr.reverse_flag=1 then dpr.reverse_money end) reverse_salary " +
        " from dp_route_task dpr " +
        " where dpr.task_plan_date>="+params.yMonth+"01 and dpr.task_plan_date<="+params.yMonth+"31 and dpr.task_status>=9 " +
        " group by dpr.drive_id,dpr.truck_id) dprm " +
        " on dtmv.drive_id = dprm.drive_id and dtmv.truck_id = dprm.truck_id " +
        " and dtmv.y_month = "+params.yMonth+" set dtmv.distance_salary = dprm.distance_salary ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        return callback(error,rows);
    });
}

function updateDamage(params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select di.drive_id,di.truck_id,sum(dc.under_cost) damage_under_fee,sum(dc.company_cost) damage_company_fee " +
        " from damage_check dc " +
        " left join damage_info di on dc.damage_id = di.id " +
        " where dc.date_id>="+params.yMonth+"01 and dc.date_id<="+params.yMonth+"31 and di.damage_status =3 " +
        " group by di.drive_id,di.truck_id)dim " +
        " on dtmv.drive_id = dim.drive_id and dtmv.truck_id = dim.truck_id and dtmv.y_month ="+params.yMonth+" " +
        " set dtmv.damage_under_fee = dim.damage_under_fee , dtmv.damage_company_fee = dim.damage_company_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamage ');
        return callback(error,rows);
    });
}

function updateCleanFee(params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select drcr.drive_id,drcr.truck_id," +
        " sum(drcr.total_price) total_clean_fee, " +
        " sum(drcr.total_trailer_fee) total_trailer_fee, " +
        " sum(drcr.car_parking_fee) car_parking_fee, " +
        " sum(drcr.total_run_fee) total_run_fee, " +
        " sum(drcr.lead_fee) lead_fee " +
        " from dp_route_load_task_clean_rel drcr " +
        " where drcr.date_id>="+params.yMonth+"01 and drcr.date_id<="+params.yMonth+"31 and drcr.status=2 " +
        " group by drcr.drive_id,drcr.truck_id) drcrm " +
        " on dtmv.drive_id = drcrm.drive_id and dtmv.truck_id = drcrm.truck_id and dtmv.y_month = " +params.yMonth+
        " set dtmv.clean_fee = drcrm.total_clean_fee , dtmv.trailer_fee = drcrm.total_trailer_fee , " +
        " dtmv.car_parking_fee = drcrm.car_parking_fee , dtmv.run_fee = drcrm.total_run_fee, " +
        " dtmv.lead_fee = drcrm.lead_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCleanFee ');
        return callback(error,rows);
    });
}

function updateHotelFee (params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select drive_id,truck_id,sum(work_count) work_count,sum(hotel_fee) hotel_fee " +
        " from drive_work " +
        " where y_month = " +params.yMonth+
        " group by drive_id,truck_id) dw on dtmv.drive_id = dw.drive_id and dtmv.truck_id = dw.truck_id" +
        " and dtmv.y_month = "+params.yMonth+" " +
        " set dtmv.work_count = dw.work_count , dtmv.hotel_fee = dw.hotel_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateHotelFee ');
        return callback(error,rows);
    });
}

function updateEtcFee (params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select te.drive_id,te.truck_id,sum(te.etc_fee) etc_fee " +
        " from truck_etc te " +
        " where te.date_id>="+params.yMonth+"01 and te.date_id<= "+params.yMonth+"31 " +
        " group by te.drive_id,te.truck_id) tem " +
        " on dtmv.drive_id = tem.drive_id and dtmv.truck_id = tem.truck_id " +
        " and dtmv.y_month = "+params.yMonth+" set dtmv.etc_fee = tem.etc_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEtcFee ');
        return callback(error,rows);
    });
}

function updateOilFee (params,callback){
    var query = " update drive_truck_month_value dtmv inner join( " +
        " select deor.drive_id,deor.truck_id,sum(deor.oil_money) oil_fee,sum(deor.urea_money) urea_fee " +
        " from drive_exceed_oil_rel deor " +
        " where deor.date_id>="+params.yMonth+"01 and deor.date_id<="+params.yMonth+"31 " +
        " group by deor.drive_id,deor.truck_id) deorm " +
        " on dtmv.drive_id = deorm.drive_id and dtmv.truck_id = deorm.truck_id and dtmv.y_month = " +params.yMonth+
        " set dtmv.oil_fee = deorm.oil_fee , dtmv.urea_fee = deorm.urea_fee ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateOilFee ');
        return callback(error,rows);
    });
}

function getDriveTruckMonthValue(params,callback) {
    var query = " select dtmv.* from drive_truck_month_value dtmv " +
        " where dtmv.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveTruckMonthValueId){
        paramsArray[i++] = params.driveTruckMonthValueId;
        query = query + " and dtmv.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dtmv.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dtmv.truck_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and dtmv.y_month = ? ";
    }
    query = query + ' order by dtmv.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveTruckMonthValue ');
        return callback(error,rows);
    });
}

function updateTruckDepreciationFee(params,callback){
    var query = " update drive_truck_month_value set depreciation_fee = ? where id is not null" ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.depreciationFee;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and y_month = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDepreciationFee ');
        return callback(error,rows);
    });
}

function updateDepreciationFee(params,callback){
    var query = " update drive_truck_month_value set insure_fee = ? , depreciation_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureFee;
    paramsArray[i++]=params.depreciationFee;
    paramsArray[i++]=params.driveTruckMonthValueId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDepreciationFee ');
        return callback(error,rows);
    });
}


module.exports ={
    addDistance : addDistance,
    updateOutput : updateOutput,
    updateInsureFee : updateInsureFee,
    updateDistanceSalary : updateDistanceSalary,
    updateDamage : updateDamage,
    updateCleanFee : updateCleanFee,
    updateHotelFee : updateHotelFee,
    updateEtcFee : updateEtcFee,
    updateOilFee : updateOilFee,
    getDriveTruckMonthValue : getDriveTruckMonthValue,
    updateTruckDepreciationFee : updateTruckDepreciationFee,
    updateDepreciationFee : updateDepreciationFee
}