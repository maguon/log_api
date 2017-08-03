ALTER TABLE `drive_info`
ADD COLUMN `confirm_date`  datetime NULL COMMENT '检证时间' AFTER `license_type`,
ADD COLUMN `address`  varchar(200) NULL COMMENT '家庭住址' AFTER `confirm_date`,
ADD COLUMN `sib_tel`  varchar(20) NULL COMMENT '家属电话' AFTER `address`;
ALTER TABLE `truck_insure_rel`
ADD COLUMN `active`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '默认-1' AFTER `insure_status`,
ADD COLUMN `date_id`  int(4) NOT NULL AFTER `active`;
ALTER TABLE `truck_info`
ADD COLUMN `truck_num`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车牌号或挂车号' AFTER `id`,
ADD COLUMN `drive_id`  int(10) NOT NULL DEFAULT 0 COMMENT '主驾ID' AFTER `the_code`,
ADD COLUMN `company_id`  int(10) NOT NULL DEFAULT 0 COMMENT '所属公司ID' AFTER `copilot`;
ADD COLUMN `truck_type`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '车辆类型(1-车头,2-挂车)' AFTER `company_id`,
ADD COLUMN `repair_status`  tinyint(1) NULL DEFAULT 1 COMMENT '维修状态(0-维修,1-正常)' AFTER `rel_id`;
ADD COLUMN `repair_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '维修状态(0-维修,1-正常)' AFTER `rel_id`,
ADD COLUMN `truck_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '车辆状态(0-停用,1-可用)' AFTER `repair_status`,
ADD COLUMN `number`  tinyint(2) NOT NULL DEFAULT 0 COMMENT '板车位数' AFTER `truck_status`;
-- ----------------------------
-- Table structure for truck_repair_rel
-- ----------------------------
DROP TABLE IF EXISTS `truck_repair_rel`;
CREATE TABLE `truck_repair_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `repair_type` tinyint(1) DEFAULT '0' COMMENT '维修类型',
  `repair_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '维修编号',
  `repair_money` decimal(10,2) DEFAULT NULL COMMENT '维修金额',
  `repair_date` datetime DEFAULT NULL COMMENT '维修时间',
  `end_date` datetime DEFAULT NULL COMMENT '结束日期',
  `date_id` int(4) NOT NULL,
  `repair_reason` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '维修原因',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_insure_type
-- ----------------------------
DROP TABLE IF EXISTS `truck_insure_type`;
CREATE TABLE `truck_insure_type` (
  `id` int(11) NOT NULL,
  `name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;