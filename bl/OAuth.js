/**
 * Created by lingxue on 2017/5/26.
 */
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OAuth.js');

function transferToken(){

    function parseAccessToken(req,res,next){
        var accessToken = req.headers[oAuthUtil.headerTokenMeta];
        if(accessToken == undefined){
            return next();
        }else{
            oAuthUtil.getToken({accessToken:accessToken},function(error,rows){
                if(error){
                    logger.error("transferToken " + error.stack);
                }else{
                    if(rows && rows.result &&rows.result.id){
                        req.params._uid = rows.result.id;
                        req.params._uname = rows.result.name;
                        req.params._utype = rows.result.type;
                        req.params._ustatus = rows.result.status;
                        req.params._uphone = rows.result.phone;
                    }
                }
                return next();
            })
        }
    }

    return parseAccessToken ;

}

function checkToken(){
    function checkAccessToken(req,res,next){
        var accessToken = req.headers[oAuthUtil.headerTokenMeta];
        if(accessToken == undefined){
            return next(sysError.NotAuthorizedError());
        }else{
            oAuthUtil.getToken({accessToken:accessToken},function(error,result){
                if(error){
                    logger.error("transferToken " + error.stack);
                    return next(sysError.NotAuthorizedError());
                }else{
                    if(result && result.id){
                        req.params._uid = result.id;
                        req.params._uname = result.name;
                        req.params._utype = result.type;
                        req.params._ustatus = result.status;
                        req.params._uphone = result.phone;
                        return next();
                    }else{
                        return next(sysError.NotAuthorizedError());
                    }
                }

            })
        }
    }
    return checkAccessToken;

}

module.exports = {
    transferToken  : transferToken ,
    checkToken : checkToken
}