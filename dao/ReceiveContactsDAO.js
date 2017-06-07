/**
 * Created by zwl on 2017/6/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveContactsDAO.js');

function addReceiveContacts(params,callback){
    var query = " insert into receive_contacts (receive_id,contacts_name,position,tel) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.position;
    paramsArray[i]=params.tel;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addReceiveContacts ');
        return callback(error,rows);
    });
}

function getReceiveContacts(params,callback) {
    var query = " select rc.* from receive_contacts rc left join receive_info re on rc.receive_id = re.id where rc.id is not null ";
    var paramsArray=[],i=0;
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and re.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getReceiveContacts ');
        return callback(error,rows);
    });
}


module.exports ={
    addReceiveContacts : addReceiveContacts,
    getReceiveContacts : getReceiveContacts
}