/**
 * Created by zwl on 2018/7/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskTransferStatDAO.js');

function getDpTaskTransferStat(params,callback) {
    var query = " select sum(dptts.transfer_count) as transfer_count,sum(dptts.plan_count) as plan_count, " +
        " dptts.transfer_city_id,c.city_name as transfer_city_name,dptts.route_end_id,c1.city_name as route_end_name,dptts.date_id " +
        " from dp_task_transfer_stat dptts " +
        " left join city_info c on dptts.transfer_city_id = c.id " +
        " left join city_info c1 on dptts.route_end_id = c1.id " +
        " where dptts.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpTaskTransferStatId){
        paramsArray[i++] = params.dpTaskTransferStatId;
        query = query + " and dptts.id = ? ";
    }
    if(params.transferStatus){
        paramsArray[i++] = params.transferStatus;
        query = query + " and dptts.transfer_status = ? ";
    }
    query = query + ' group by dptts.transfer_city_id,c.city_name,dptts.route_end_id,c1.city_name,dptts.date_id ';
    query = query + ' order by dptts.date_id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskTransferStat ');
        return callback(error,rows);
    });
}


module.exports ={
    getDpTaskTransferStat : getDpTaskTransferStat
}