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