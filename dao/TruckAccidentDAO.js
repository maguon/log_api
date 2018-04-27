/**
 * Created by zwl on 2018/2/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentDAO.js');

function addTruckAccident(params,callback){
    var query = " insert into truck_accident_info ( declare_user_id , truck_id , drive_id , dp_route_task_id , " +
        " accident_date , address , lng , lat , date_id , accident_explain ) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.accidentDate;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.accidentExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccident ');
        return callback(error,rows);
    });
}

function getTruckAccident(params,callback) {
    var query = " select ta.*,u.real_name as declare_user_name,c.city_name as city_route_start,c1.city_name as city_route_end,t.truck_num,t.truck_type,tb.brand_name, " +
        " d.drive_name,d.tel,t.company_id,cp.company_name,cp.operate_type,tac.truck_accident_type,tac.profit,tac.under_user_id,tac.under_user_name,tac.under_cost, " +
        " tac.company_cost,tac.end_date,tac.remark from truck_accident_info ta " +
        " left join user_info u on ta.declare_user_id = u.uid " +
        " left join dp_route_task dpr on ta.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info c1 on dpr.route_end_id = c1.id " +
        " left join truck_info t on ta.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_accident_check tac on ta.id = tac.truck_accident_id " +
        " left join truck_accident_insure_rel tar on ta.id = tar.accident_id " +
        " left join company_info cp on t.company_id = cp.id" +
        " where ta.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckAccidentId){
        paramsArray[i++] = params.truckAccidentId;
        query = query + " and ta.id = ? ";
    }
    if(params.declareUserId){
        paramsArray[i++] = params.declareUserId;
        query = query + " and ta.declare_user_id = ? ";
    }
    if(params.declareUserName){
        paramsArray[i++] = params.declareUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and ta.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and ta.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.accidentDateStart){
        paramsArray[i++] = params.accidentDateStart +" 00:00:00";
        query = query + " and ta.accident_date >= ? ";
    }
    if(params.accidentDateEnd){
        paramsArray[i++] = params.accidentDateEnd +" 23:59:59";
        query = query + " and ta.accident_date <= ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and ta.dp_route_task_id = ? ";
    }
    if(params.truckAccidentType){
        paramsArray[i++] = params.truckAccidentType;
        query = query + " and tac.truck_accident_type = ? ";
    }
    if(params.underUserId){
        paramsArray[i++] = params.underUserId;
        query = query + " and tac.under_user_id = ? ";
    }
    if(params.underUserName){
        paramsArray[i++] = params.underUserName;
        query = query + " and tac.under_user_name = ? ";
    }
    if(params.accidentStatus){
        paramsArray[i++] = params.accidentStatus;
        query = query + " and ta.accident_status = ? ";
    }
    if(params.accidentInsureId){
        paramsArray[i++] = params.accidentInsureId;
        query = query + " and tar.accident_insure_id = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and ta.stat_status = ? ";
    }
    query = query + " group by ta.id";
    query = query + " order by ta.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccident ');
        return callback(error,rows);
    });
}

function updateTruckAccident(params,callback){
    var query = " update truck_accident_info set accident_date = ? , dp_route_task_id = ? , address = ? , lng = ? , lat = ? , accident_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.accidentDate;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.accidentExplain;
    paramsArray[i] = params.truckAccidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccident ');
        return callback(error,rows);
    });
}

function updateTruckAccidentStatus(params,callback){
    var query = " update truck_accident_info set accident_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.accidentStatus;
    paramsArray[i]=params.truckAccidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentStatus ');
        return callback(error,rows);
    });
}

function updateTruckAccidentStatStatus(params,callback){
    var query = " update truck_accident_info set stat_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.statStatus;
    paramsArray[i]=params.accidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentStatStatus ');
        return callback(error,rows);
    });
}

function getTruckAccidentNotCheckCount(params,callback) {
    var query = " select count(ta.id) as truck_accident_count,ta.accident_status from truck_accident_info ta where ta.id is not null ";
    var paramsArray=[],i=0;
    query = query + " group by ta.accident_status ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentNotCheckCount ');
        return callback(error,rows);
    });
}

function getTruckAccidentTotalCost(params,callback) {
    var query = " select sum(tac.company_cost) as company_cost,sum(tac.under_cost) as under_cost from truck_accident_info ta " +
        " left join truck_accident_check tac on ta.id = tac.truck_accident_id where ta.id is not null ";
    var paramsArray=[],i=0;
    if(params.accidentStatus){
        paramsArray[i++] = params.accidentStatus;
        query = query + " and ta.accident_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentTotalCost ');
        return callback(error,rows);
    });
}

function getTruckAccidentTypeMonthStat(params,callback){
    var query = " select db.y_month,tat.id,count(case when ta.accident_status = "+params.accidentStatus+" then ta.id end) as accident_count from date_base db " +
        " inner join truck_accident_type tat " +
        " left join truck_accident_check tac on db.id = tac.date_id and tat.id = tac.truck_accident_type " +
        " left join truck_accident_info ta on tac.truck_accident_id = ta.id where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,tat.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentTypeMonthStat ');
        return callback(error,rows);
    });
}

function getTruckAccidentCostMonthStat(params,callback){
    var query = " select db.y_month,sum(case when ta.accident_status = "+params.accidentStatus+" then tac.company_cost end) as company_cost, " +
        " sum(case when ta.accident_status = "+params.accidentStatus+" then tac.under_cost end) as under_cost from date_base db " +
        " left join truck_accident_check tac on db.id = tac.date_id " +
        " left join truck_accident_info ta on tac.truck_accident_id = ta.id where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentCostMonthStat ');
        return callback(error,rows);
    });
}

module.exports ={
    addTruckAccident : addTruckAccident,
    getTruckAccident : getTruckAccident,
    updateTruckAccident : updateTruckAccident,
    updateTruckAccidentStatus : updateTruckAccidentStatus,
    updateTruckAccidentStatStatus : updateTruckAccidentStatStatus,
    getTruckAccidentNotCheckCount : getTruckAccidentNotCheckCount,
    getTruckAccidentTotalCost : getTruckAccidentTotalCost,
    getTruckAccidentTypeMonthStat : getTruckAccidentTypeMonthStat,
    getTruckAccidentCostMonthStat : getTruckAccidentCostMonthStat
}
