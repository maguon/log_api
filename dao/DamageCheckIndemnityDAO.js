/**
 * Created by zwl on 2018/3/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckIndemnityDAO.js');

function addDamageCheckIndemnity(params,callback){
    var query = " insert into damage_check_indemnity (damage_check_id,bank_number,bank_user_name,bank_name, " +
        " city_id,receive_id,plan_money,indemnity_explain) values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i++]=params.bankNumber;
    paramsArray[i++]=params.bankUserName;
    paramsArray[i++]=params.bankName;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.planMoney;
    paramsArray[i]=params.indemnityExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageCheckIndemnity ');
        return callback(error,rows);
    });
}

function getDamageCheckIndemnity(params,callback) {
    var query = " select dci.*,c.city_name,r.short_name from damage_check_indemnity dci " +
        " left join damage_check dc on dci.damage_check_id = dc.id " +
        " left join city_info c on dci.city_id = c.id " +
        " left join receive_info r on dci.receive_id = r.id where dci.id is not null ";
    var paramsArray=[],i=0;
    if(params.indemnityId){
        paramsArray[i++] = params.indemnityId;
        query = query + " and dci.id = ? ";
    }
    if(params.damageCheckId){
        paramsArray[i++] = params.damageCheckId;
        query = query + " and dci.damage_check_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckIndemnity ');
        return callback(error,rows);
    });
}

function updateDamageCheckIndemnity(params,callback){
    var query = " update damage_check_indemnity set bank_number = ? , bank_user_name = ? , bank_name = ? , " +
        " city_id = ? , receive_id = ? , plan_money = ? , indemnity_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.bankNumber;
    paramsArray[i++]=params.bankUserName;
    paramsArray[i++]=params.bankName;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.planMoney;
    paramsArray[i++]=params.indemnityExplain;
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


module.exports ={
    addDamageCheckIndemnity : addDamageCheckIndemnity,
    getDamageCheckIndemnity : getDamageCheckIndemnity,
    updateDamageCheckIndemnity : updateDamageCheckIndemnity,
    updateDamageCheckIndemnityImage : updateDamageCheckIndemnityImage
}