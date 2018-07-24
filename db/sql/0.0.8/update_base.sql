-- ----------------------------
-- 2018-07-19 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `receive_type`  tinyint(1) NULL DEFAULT 1 COMMENT '经销商类型(1-4S店,2-大客户,3-临时停放地)' AFTER `receive_name`;
-- ----------------------------
-- 2018-07-24 更新
-- ----------------------------
ALTER TABLE `settle_handover_info`
ADD COLUMN `serial_number`  int(10) NOT NULL DEFAULT 0 COMMENT '序号' AFTER `number`;
-- ----------------------------
-- 2018-07-24 更新 调度中转
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `transfer_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否中转标识(0-否,1-是)' AFTER `load_task_status`,
ADD COLUMN `transfer_city_id`  int(10) NULL DEFAULT 0 COMMENT '中转城市ID' AFTER `transfer_flag`,
ADD COLUMN `transfer_addr_id`  int(10) NULL DEFAULT 0 COMMENT '中转站装车地ID' AFTER `transfer_city_id`;

ALTER TABLE `dp_task_stat`
ADD COLUMN `transfer_count`  int(10) NULL DEFAULT 0 COMMENT '中转数' AFTER `not_plan_count`;
-- ----------------------------
-- Table structure for dp_transfer_demand_info
-- ----------------------------
DROP TABLE IF EXISTS `dp_transfer_demand_info`;
CREATE TABLE `dp_transfer_demand_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0' COMMENT '操作人ID',
  `route_start_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地ID',
  `base_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地发货地址ID',
  `transfer_city_id` int(10) NOT NULL DEFAULT '0' COMMENT '中转站ID',
  `transfer_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '中转站装车地ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `transfer_count` int(10) NOT NULL DEFAULT '0' COMMENT '中转数',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `transfer_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-取消,1-正常,2-完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_task_transfer_stat
-- ----------------------------
DROP TABLE IF EXISTS `dp_task_transfer_stat`;
CREATE TABLE `dp_task_transfer_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `base_addr_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `transfer_city_id` int(10) NOT NULL COMMENT '中转城市ID',
  `transfer_addr_id` int(10) NOT NULL COMMENT '中转站ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `transfer_count` int(10) NOT NULL DEFAULT '0' COMMENT '中转数',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `transfer_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '中转状态(1-未完成,2-已完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_start_id`,`base_addr_id`,`transfer_city_id`,`transfer_addr_id`,`route_end_id`,`receive_id`,`date_id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

