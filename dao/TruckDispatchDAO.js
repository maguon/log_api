/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDispatchDAO.js');

function getTruckDispatch(params,callback) {
    var query = " select td.*,ci.city_name,cs.city_name as task_start_name,ce.city_name as task_end_name," +
        " h.truck_num,h.truck_tel,h.drive_id,h.company_id,h.truck_type,t.number as trail_number, " +
        " d.drive_name,d.tel,c.company_name,c.operate_type from truck_dispatch td " +
        " left join city_info ci on td.current_city = ci.id " +
        " left join city_info cs on td.task_start = cs.id " +
        " left join city_info ce on td.task_end = ce.id " +
        " left join truck_info h on td.truck_id = h.id " +
        " left join truck_info t on h.rel_id = t.id " +
        " left join drive_info d on h.drive_id = d.id " +
        " left join company_info c on h.company_id = c.id where td.truck_id is not null ";
    var paramsArray=[],i=0;
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.cityName){
        paramsArray[i++] = params.cityName;
        query = query + " and ci.city_name = ? ";
    }
    if(params.dispatchFlag){
        paramsArray[i++] = params.dispatchFlag;
        query = query + " and td.dispatch_flag = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDispatch ');
        return callback(error,rows);
    });
}


module.exports = {
    getTruckDispatch: getTruckDispatch
}
