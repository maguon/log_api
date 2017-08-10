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
ADD COLUMN `repair_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '维修状态(0-维修,1-正常)' AFTER `rel_id`,
ADD COLUMN `truck_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '车辆状态(0-停用,1-可用)' AFTER `repair_status`,
ADD COLUMN `number`  tinyint(2) NOT NULL DEFAULT 0 COMMENT '板车位数' AFTER `truck_status`;

ALTER TABLE `storage_info`
DROP COLUMN `row`,
DROP COLUMN `col`;

ALTER TABLE `storage_parking`
ADD COLUMN `storage_area_id`  int(10) NOT NULL COMMENT '仓库分区ID' AFTER `storage_id`;
-- ----------------------------
-- Table structure for truck_repair_rel
-- ----------------------------
DROP TABLE IF EXISTS `truck_repair_rel`;
CREATE TABLE `truck_repair_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) DEFAULT NULL COMMENT '主驾ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `repair_money` decimal(10,2) DEFAULT NULL COMMENT '维修金额',
  `repair_date` datetime DEFAULT NULL COMMENT '维修时间',
  `end_date` datetime DEFAULT NULL COMMENT '结束日期',
  `repair_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '维修状态(0-维修,1-正常)',
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
-- ----------------------------
-- Table structure for storage_area_info
-- ----------------------------
DROP TABLE IF EXISTS `storage_area_info`;
CREATE TABLE `storage_area_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `storage_id` int(10) NOT NULL COMMENT '仓库ID',
  `area_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分区名称',
  `row` int(10) NOT NULL COMMENT '排位',
  `col` int(10) NOT NULL COMMENT '道位',
  `area_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '仓储区状态(0-停用,1-可用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;