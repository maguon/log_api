/**
 * Created by zwl on 2018/4/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDamageRelDAO.js');

function addDriveSalaryDamageRel(params,callback){
    var query = " insert into drive_salary_damage_rel (drive_salary_id,damage_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryDamageRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryDamageRel(params,callback) {
    var query = " select dsdr.*,c.vin,c.make_name,e.short_name as en_short_name,r.short_name as r_short_name, " +
        " da.created_on as declare_date,da.damage_explain,dc.damage_type,dc.damage_link_type,dc.under_cost,dc.company_cost " +
        " from drive_salary_damage_rel dsdr " +
        " left join drive_salary ds on dsdr.drive_salary_id = ds.id " +
        " left join damage_info da on dsdr.damage_id = da.id " +
        " left join damage_check dc on da.id = dc.damage_id " +
        " left join car_info c on da.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where dsdr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and dsdr.drive_salary_id = ? ";
    }
    query = query + ' group by dsdr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryDamageRel ');
        return callback(error,rows);
    });
}

function deleteDriveSalaryDamageRel(params,callback){
    var query = " delete from drive_salary_damage_rel where drive_salary_id = ? and damage_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveSalaryDamageRel ');
        return callback(error,rows);
    });
}



module.exports ={
    addDriveSalaryDamageRel : addDriveSalaryDamageRel,
    getDriveSalaryDamageRel : getDriveSalaryDamageRel,
    deleteDriveSalaryDamageRel : deleteDriveSalaryDamageRel
}