ALTER TABLE `drive_info`
ADD UNIQUE INDEX `tel` (`tel`) ;
ALTER TABLE `dp_route_load_task_detail`
ADD COLUMN `arrive_date`  datetime NULL COMMENT '送达时间' AFTER `vin`;
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '送达统计时间' AFTER `arrive_date`;
ALTER TABLE `user_info`
ADD COLUMN `avatar_image`  varchar(100) NULL COMMENT '用户头像' AFTER `gender`;

-- ----------------------------
-- Table structure for drive_refuel
-- ----------------------------
DROP TABLE IF EXISTS `drive_refuel`;
CREATE TABLE `drive_refuel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `date_id` int(4) NOT NULL COMMENT '加油申报统计时间',
  `refuel_date` datetime DEFAULT NULL COMMENT '加油时间',
  `refuel_volume` decimal(10,2) NOT NULL COMMENT '加油量',
  `dp_demand_id` int(10) DEFAULT NULL COMMENT '路线ID',
  `refuel_address_type` tinyint(1) NOT NULL COMMENT '加油地类别(1-内部加油,2-外部加油)',
  `refuel_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加油详细地址',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `refuel_money` decimal(10,2) DEFAULT NULL COMMENT '加油金额',
  `check_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '审核状态(1-待审核,2-通过,3-拒绝)',
  `check_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核拒绝原因',
  `check_user_id` int(10) DEFAULT NULL COMMENT '审核人ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加油申报时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for car_exception_rel
-- ----------------------------
DROP TABLE IF EXISTS `car_exception_rel`;
CREATE TABLE `car_exception_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `exception_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车辆状态(1-异常,2-正常)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '异常描述',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for user_device
-- ----------------------------
DROP TABLE IF EXISTS `user_device`;
CREATE TABLE `user_device` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL COMMENT '用户ID',
  `device_token` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备标识',
  `version` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备版本',
  `app_type` tinyint(1) NOT NULL COMMENT 'app登录类型(1-仓储app,2-车管app,3-调度app,4-司机app)',
  `device_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备类型(1-android,2-ios)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `dp_task_stat`
ADD COLUMN `not_plan_count`  int(10) NULL DEFAULT 0 COMMENT '未派发台数' AFTER `plan_count`;
ALTER TABLE `dp_route_load_task`
ADD COLUMN `field_op_id`  int(10) NULL COMMENT '现场调度员ID' AFTER `user_id`;
ADD COLUMN `real_count`  int(10) NULL DEFAULT 0 COMMENT '实际装车数量' AFTER `plan_count`;
ALTER TABLE `dp_route_load_task_detail`
ADD COLUMN `dp_route_task_id`  int(10) NULL COMMENT '路线ID' AFTER `id`;
ALTER TABLE `dp_demand_info`
ADD COLUMN `plan_count`  int(10) NULL DEFAULT 0 COMMENT '计划派发商品车数量' AFTER `pre_count`;