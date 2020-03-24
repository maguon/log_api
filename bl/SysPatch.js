var Seq = require('seq');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysPatch.js');

var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');

function setOutputPatch(req,res,next){
    var idArray =[];
    var outputObj ={};
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTaskPatch({},function(rows,error){
            if (error) {
                logger.error(' getDpRouteLoadTaskPatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                idArray = rows;
                that();
            }
        })
    }).seq(function(){
        Seq(idArray).seqEach(function(rowObj,i){
            var that = this;
            outputObj.id=rowObj.id;
            Seq().seq(function(){
                var that = this;
                dpRouteLoadTaskDAO.getDpRouteLoadTaskList({dpRouteLoadTaskId:rowObj.id},function(rows,error){
                    if (error) {
                        logger.error(' getDpRouteLoadTask ' + error.message);
                        resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                        return next();
                    } else {
                        if (rows && rows.length>0&&rows[0].output_ratio<1) {
                            outputObj.outputRatio = rows[0].output_ratio;
                            that();
                        } else {
                            outputObj.outputRatio = 1;
                            that();
                        }
                    }
                })
            }).seq(function(){
                dpRouteLoadTaskDAO.updateOutputById(outputObj,function(result,error){
                    if (error) {
                        logger.error(' updateOutputById ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result.affectedRows!=1){
                            logger.warn('updateOutputById '+ rowObj.id);
                        }
                        that();
                    }
                })
            })

        }).seq(function(){
            resUtil.resetUpdateRes(res,{affectedRows:200},null);
            return next();
        })
    })
}

module.exports = {
    setOutputPatch
}