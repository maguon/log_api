-- ----------------------------
-- 2018-01-24 更新
-- ----------------------------
ALTER TABLE `log_base`.`car_info` ADD COLUMN `order_date_id` int(4) AFTER `order_date`;
ALTER TABLE `log_base`.`receive_info` CHANGE COLUMN `clean_fee` `clean_fee` decimal(10,2) DEFAULT 0 COMMENT '洗车费';
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `dp_route_task_id` int(10) NOT NULL AFTER `id`;
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `actual_price` decimal(10,2) UNSIGNED COMMENT '实际费用' AFTER `total_price`;

ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `drive_id`  int(10) NOT NULL COMMENT '司机ID' AFTER `dp_route_load_task_id`;
ADD COLUMN `car_count`  int(10) NULL DEFAULT 0 COMMENT '装车台数' AFTER `actual_price`;
CHANGE COLUMN `collect_status` `status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '领取状态(0-未通过 ,1-未审核,2-已通过)' AFTER `date_id`;
ADD COLUMN `clean_date`  datetime NULL COMMENT '领取时间' AFTER `drive_user_id`;

ALTER TABLE `damage_insure_rel`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`damage_insure_id`, `damage_id`),
ADD UNIQUE INDEX `id` (`id`) ;

ALTER TABLE `truck_repair_rel`
ADD COLUMN `repair_station_id`  int(10) NULL DEFAULT NULL COMMENT '维修站ID' AFTER `repair_date`,
ADD COLUMN `repair_type`  tinyint(1) NULL DEFAULT NULL COMMENT '维修类型(1-事故,2-非事故)' AFTER `repair_id`;
ADD COLUMN `accident_id`  int(10) NULL COMMENT '事故ID' AFTER `repair_type`;

-- ----------------------------
-- Table structure for damage_type
-- ----------------------------
DROP TABLE IF EXISTS `damage_type`;
CREATE TABLE `damage_type` (
  `id` int(11) NOT NULL,
  `name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for repair_station_info
-- ----------------------------
DROP TABLE IF EXISTS `repair_station_info`;
CREATE TABLE `repair_station_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_station_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '维修站名称',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `repair_station_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '维修站状态(0-不可用,1-可用)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `repair_station_name` (`repair_station_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_rel
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_rel`;
CREATE TABLE `truck_accident_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accident_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '事故名称',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '事故地点',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `accident_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '事故状态(1-未完结,2-完结)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;