-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `truck_info`
ADD COLUMN `output_company_id`  int(10) NULL DEFAULT 0 COMMENT '产值公司' AFTER `company_id`,
ADD COLUMN `output_company_name`  varchar(50) NULL DEFAULT NULL COMMENT '产值公司名称' AFTER `output _company_id`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `city_route_info`
ADD COLUMN `reverse_money`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '倒板金额' AFTER `protect_fee`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `drive_info`
ADD COLUMN `bank_number`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '账号' AFTER `sib_tel`,
ADD COLUMN `bank_name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户行' AFTER `bank_user_name`,
ADD COLUMN `bank_user_name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '户名' AFTER `bank_number`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_work
-- ----------------------------
DROP TABLE IF EXISTS `drive_work`;
CREATE TABLE `drive_work` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '司机姓名',
  `truck_id` int(10) DEFAULT '0' COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名(手机号)',
  `y_month` int(4) NOT NULL DEFAULT '0' COMMENT '月份',
  `social_security_fee` decimal(10,2) DEFAULT '0.00' COMMENT '社保费',
  `work_count` int(10) DEFAULT '0' COMMENT '出勤天数',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `car_vin_match`
ADD COLUMN `remark`  varchar(200) NULL COMMENT '备注' AFTER `make_name`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `size_type`  tinyint(1) NULL DEFAULT NULL COMMENT '大小车类型(0-小车,1-大车)' AFTER `port_time`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `truck_info`
ADD COLUMN `operate_type`  tinyint(1) NULL DEFAULT NULL COMMENT '所属类型(1-自营,2-外协,3-供方,4-承包)' AFTER `vice_drive_id`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
update truck_info set operate_type = 1;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_car_size_type`;
DELIMITER ;;
CREATE TRIGGER `trg_update_car_size_type` BEFORE INSERT ON `car_info` FOR EACH ROW BEGIN
set @count =(select count(id) from car_vin_match where make_id = new.make_id and vin = substring(new.vin,4,5));
IF(@count>0) THEN
set new.size_type = 1;
ELSEIF(@count=0) THEN
set new.size_type = 0;
END IF;
END
;;
DELIMITER ;