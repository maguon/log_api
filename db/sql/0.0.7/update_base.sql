-- ----------------------------
-- 2018-06-08 更新
-- ----------------------------
ALTER TABLE `damage_insure`
ADD COLUMN `damage_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '定损金额' AFTER `insure_user_id`;
-- ----------------------------
-- Table structure for settle_handover_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `settle_handover_car_rel`;
CREATE TABLE `settle_handover_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settle_handover_id` int(10) NOT NULL DEFAULT '0' COMMENT '交接单ID',
  `car_id` int(10) NOT NULL DEFAULT '0' COMMENT '商品车ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for settle_handover_info
-- ----------------------------
DROP TABLE IF EXISTS `settle_handover_info`;
CREATE TABLE `settle_handover_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` bigint(4) NOT NULL COMMENT '交接单编号',
  `entrust_id` int(10) NOT NULL DEFAULT '0' COMMENT '委托方ID',
  `op_user_id` int(10) DEFAULT NULL COMMENT '提交人ID',
  `received_date` date DEFAULT NULL COMMENT '交接单收到日期',
  `route_start_id` int(10) NOT NULL DEFAULT '0' COMMENT '城市线路ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `car_count` int(10) DEFAULT '0' COMMENT '交接商品车数量',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `date_id` int(4) DEFAULT NULL COMMENT '提交时间统计',
  `handove_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '交接单照片',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for settle_seq
-- ----------------------------
DROP TABLE IF EXISTS `settle_seq`;
CREATE TABLE `settle_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `y_month` int(4) NOT NULL,
  `seq_id` bigint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for drive_peccancy
-- ----------------------------
DROP TABLE IF EXISTS `drive_peccancy`;
CREATE TABLE `drive_peccancy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `fine_score` int(4) NOT NULL DEFAULT '0' COMMENT '扣分',
  `fine_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '罚款金额',
  `start_date` date DEFAULT NULL COMMENT '起始时间',
  `end_date` date DEFAULT NULL COMMENT '结束时间',
  `fine_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '扣款状态(1-未扣,2-已扣)',
  `op_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人ID',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `stat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '结算状态(1-未结算,2-已结算)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for drive_exceed_oil
-- ----------------------------
DROP TABLE IF EXISTS `drive_exceed_oil`;
CREATE TABLE `drive_exceed_oil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_id` int(10) NOT NULL DEFAULT '0' COMMENT '调度编号ID',
  `exceed_oil_quantity` decimal(10,2) NOT NULL DEFAULT '0' COMMENT '超油量',
  `exceed_oil_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '超油金额',
  `fine_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '扣款状态(1-未扣,2-已扣)',
  `op_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人ID',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
    `stat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '结算状态(1-未结算,2-已结算)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for drive_salary_exceed_oil_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_exceed_oil_rel`;
CREATE TABLE `drive_salary_exceed_oil_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_salary_id` int(10) NOT NULL COMMENT '司机工资ID',
  `exceed_oil_id` int(10) NOT NULL COMMENT '超油编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `exceed_oil` (`exceed_oil_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for drive_salary_peccancy_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_peccancy_rel`;
CREATE TABLE `drive_salary_peccancy_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_salary_id` int(10) NOT NULL COMMENT '司机工资ID',
  `peccancy_id` int(10) NOT NULL COMMENT '违章编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `peccancy_id` (`peccancy_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-06-14 更新
-- ----------------------------
ALTER TABLE `drive_salary`
ADD COLUMN `refund_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销费用' AFTER `plan_salary`;
-- ----------------------------
-- 2018-06-19 更新
-- ----------------------------
ALTER TABLE `city_route_info`
ADD COLUMN `protect_fee`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '保道费' AFTER `distance`;
-- ----------------------------
-- 2018-06-20 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `protect_fee`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '保道费' AFTER `distance`;