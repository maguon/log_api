/**
 * Created by zwl on 2018/3/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckIndemnityDAO.js');

function addDamageCheckIndemnity(params,callback){
    var query = " insert into damage_check_indemnity (damage_id,damage_check_id,bank_number,bank_user_name,bank_name, " +
        " city_id,receive_name,plan_money,apply_user_id,apply_explain) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageId;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i++]=params.bankNumber;
    paramsArray[i++]=params.bankUserName;
    paramsArray[i++]=params.bankName;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.planMoney;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.applyExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageCheckIndemnity ');
        return callback(error,rows);
    });
}

function getDamageCheckIndemnity(params,callback) {
    var query = " select dci.*,d.created_on as declare_date,u.real_name as apply_user_name,c.city_name from damage_check_indemnity dci " +
        " left join damage_check dc on dci.damage_check_id = dc.id " +
        " left join damage_info d on dci.damage_id = d.id " +
        " left join city_info c on dci.city_id = c.id " +
        " left join user_info u on dci.apply_user_id = u.uid where dci.id is not null ";
    var paramsArray=[],i=0;
    if(params.indemnityId){
        paramsArray[i++] = params.indemnityId;
        query = query + " and dci.id = ? ";
    }
    if(params.damageCheckId){
        paramsArray[i++] = params.damageCheckId;
        query = query + " and dci.damage_check_id = ? ";
    }
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and dci.damage_id = ? ";
    }
    if(params.indemnityStatus){
        paramsArray[i++] = params.indemnityStatus;
        query = query + " and dci.indemnity_status = ? ";
    }
    if(params.applyUserName){
        paramsArray[i++] = params.applyUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.planMoneyStart){
        paramsArray[i++] = params.planMoneyStart;
        query = query + " and dci.plan_money >= ? ";
    }
    if(params.planMoneyEnd){
        paramsArray[i++] = params.planMoneyEnd;
        query = query + " and dci.plan_money <= ? ";
    }
    if(params.receiveName){
        paramsArray[i++] = params.receiveName;
        query = query + " and dci.receive_name = ? ";
    }
    if(params.applyDateStart){
        paramsArray[i++] = params.applyDateStart +" 00:00:00";
        query = query + " and dci.created_on >= ? ";
    }
    if(params.applyDateEnd){
        paramsArray[i++] = params.applyDateEnd +" 23:59:59";
        query = query + " and dci.created_on <= ? ";
    }
    if(params.indemnityDateStart){
        paramsArray[i++] = params.indemnityDateStart +" 00:00:00";
        query = query + " and dci.indemnity_date >= ? ";
    }
    if(params.indemnityDateEnd){
        paramsArray[i++] = params.indemnityDateEnd +" 23:59:59";
        query = query + " and dci.indemnity_date <= ? ";
    }
    query = query + " order by dci.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckIndemnity ');
        return callback(error,rows);
    });
}

function updateDamageCheckIndemnity(params,callback){
    var query = " update damage_check_indemnity set bank_number = ? , bank_user_name = ? , bank_name = ? , " +
        " city_id = ? , receive_name = ? , plan_money = ? , apply_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.bankNumber;
    paramsArray[i++]=params.bankUserName;
    paramsArray[i++]=params.bankName;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.planMoney;
    paramsArray[i++]=params.applyExplain;
    paramsArray[i]=params.indemnityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheckIndemnity ');
        return callback(error,rows);
    });
}

function updateDamageCheckIndemnityImage(params,callback){
    var query = " update damage_check_indemnity set voucher_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.voucherImage;
    paramsArray[i]=params.indemnityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheckIndemnityImage ');
        return callback(error,rows);
    });
}

function updateIndemnity(params,callback){
    var query = " update damage_check_indemnity set actual_money = ? , indemnity_date = ? , indemnity_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.indemnityDate;
    paramsArray[i++]=params.indemnityExplain;
    paramsArray[i]=params.indemnityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateIndemnity ');
        return callback(error,rows);
    });
}

function updateIndemnityStatus(params,callback){
    var query = " update damage_check_indemnity set indemnity_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.indemnityStatus;
    paramsArray[i]=params.indemnityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateIndemnityStatus ');
        return callback(error,rows);
    });
}

function getIndemnityStatusCount(params,callback) {
    var query = " select dci.indemnity_status,count(dci.id) as indemnity_status_count from damage_check_indemnity dci where dci.id is not null ";
    var paramsArray=[],i=0;
    if(params.indemnityStatus){
        paramsArray[i++] = params.indemnityStatus;
        query = query + " and dci.indemnity_status = ? ";
    }
    query = query + " group by dci.indemnity_status";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getIndemnityStatusCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageCheckIndemnity : addDamageCheckIndemnity,
    getDamageCheckIndemnity : getDamageCheckIndemnity,
    updateDamageCheckIndemnity : updateDamageCheckIndemnity,
    updateDamageCheckIndemnityImage : updateDamageCheckIndemnityImage,
    updateIndemnity : updateIndemnity,
    updateIndemnityStatus : updateIndemnityStatus,
    getIndemnityStatusCount : getIndemnityStatusCount
}