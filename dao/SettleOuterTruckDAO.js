/**
 * Created by zwl on 2019/7/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruckDAO.js');

function addSettleOuterTruck(params,callback){
    var query = " insert into settle_outer_truck (company_id,make_id,make_name," +
        " route_start_id,route_start,route_end_id,route_end,distance,fee) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleOuterTruck ');
        return callback(error,rows);
    });
}

function addSettleOuterTruckData(params,callback){
    var query = " insert into settle_outer_truck (company_id,make_id,make_name," +
        " route_start_id,route_start,route_end_id,route_end,distance,fee) " +
        " select ? , ? , ? , ? , ? , ? , ? , ? , ? from dual " +
        " where exists(select id from company_info where id=? and operate_type=2)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i]=params.companyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleOuterTruckData ');
        return callback(error,rows);
    });
}

function getSettleOuterTruck(params,callback) {
    var query = " select sot.*,c.company_name from settle_outer_truck sot " +
        " left join company_info c on sot.company_id = c.id " +
        " where sot.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and sot.company_id = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and sot.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sot.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sot.route_end_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruck ');
        return callback(error,rows);
    });
}

function getSettleOuterTruckList(params,callback) {
    var query = " select dpr.id,dpr.truck_id,t.truck_num,cm.company_name,dpr.drive_id,d.drive_name, " +
        " c.vin,c.make_name,e.short_name as e_short_name,c.route_start,ba.addr_name,c.route_end, " +
        " r.short_name as r_short_name,c.order_date,sot.distance,sot.fee,dpr.task_plan_date " +
        " from dp_route_task dpr " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join company_info cm on t.company_id = cm.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join dp_route_load_task_detail drltd on dpr.id = drltd.dp_route_task_id " +
        " left join car_info c on drltd.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id " +
        " and c.route_end_id = sot.route_end_id and t.company_id = sot.company_id " +
        " left join settle_outer_invoice_car_rel soicr on c.id = soicr.car_id " +
        " where dpr.id is not null and c.car_status=9 ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.settleStatus){
        if(params.settleStatus==1){
            query = query + " and soicr.car_id is null ";
        }else{
            query = query + " and soicr.car_id is not null ";
        }
    }
    query = query + '  order by dpr.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruckList ');
        return callback(error,rows);
    });
}

// 2020-01-06 新建接口：外协导入车辆查�?
function getSettleOuterCarList(params,callback) {
    var query = " select c.id,cm.company_name, " +
        " c.vin,c.make_name,e.short_name as e_short_name,c.route_start,ba.addr_name,c.route_end, " +
        " r.short_name as r_short_name,c.order_date,sot.distance,sot.fee " +
        " from car_info c " +
        " left join company_info cm on c.company_id = cm.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id " +
        " and c.route_end_id = sot.route_end_id and c.company_id = sot.company_id " +
        " left join settle_outer_invoice_car_rel soicr on c.id = soicr.car_id " +
        " where c.id is not null and c.company_id<>0  ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.company_id = ? ";
    }
    if(params.settleStatus){
        if(params.settleStatus==1){
            query = query + " and soicr.car_id is null ";
        }else{
            query = query + " and soicr.car_id is not null ";
        }
    }
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruckCarList ');
        return callback(error,rows);
    });
}

function getSettleOuterTruckCarCount(params,callback) {
    var query = " select count(c.id)as settle_car_count,convert(sum(sot.distance*sot.fee),decimal(10,2)) as settle_car_price " +
        " from dp_route_task dpr " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join dp_route_load_task_detail drltd on dpr.id = drltd.dp_route_task_id " +
        " left join car_info c on drltd.car_id = c.id " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id " +
        " and c.route_end_id = sot.route_end_id and t.company_id = sot.company_id " +
        " left join settle_outer_invoice_car_rel soicr on c.id = soicr.car_id " +
        " where dpr.id is not null and c.car_status=9 ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.settleStatus){
        if(params.settleStatus==1){
            query = query + " and soicr.car_id is null ";
        }else{
            query = query + " and soicr.car_id is not null ";
        }
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruckCarCount ');
        return callback(error,rows);
    });
}


function getSettleOuterCarCount(params,callback) {
    var query = " select count(c.id)as settle_car_count,convert(sum(sot.distance*sot.fee),decimal(10,2)) as settle_car_price " +
        " from car_info c " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id " +
        " and c.route_end_id = sot.route_end_id and c.company_id = sot.company_id " +
        " left join settle_outer_invoice_car_rel soicr on c.id = soicr.car_id " +
        " where c.id is not null and c.company_id<>0 and c.car_status=9 ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.company_id = ? ";
    }
    if(params.settleStatus){
        if(params.settleStatus==1){
            query = query + " and soicr.car_id is null ";
        }else{
            query = query + " and soicr.car_id is not null ";
        }
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterCarCount ');
        return callback(error,rows);
    });
}

function updateSettleOuterTruck(params,callback){
    var query = " update settle_outer_truck set distance = ? , fee = ? " +
        " where company_id = ? and make_id = ? and route_start_id = ? and route_end_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleOuterTruck ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleOuterTruck : addSettleOuterTruck,
    addSettleOuterTruckData : addSettleOuterTruckData,
    getSettleOuterTruck : getSettleOuterTruck,
    getSettleOuterTruckList : getSettleOuterTruckList,
    getSettleOuterCarList : getSettleOuterCarList,
    getSettleOuterTruckCarCount : getSettleOuterTruckCarCount,
    getSettleOuterCarCount : getSettleOuterCarCount,
    updateSettleOuterTruck : updateSettleOuterTruck
}
