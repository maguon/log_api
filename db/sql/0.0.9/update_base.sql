-- ----------------------------
-- 2018-09-06 更新
-- ----------------------------
ALTER TABLE `dp_transfer_demand_info`
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `transfer_addr_name`  varchar(50) NULL COMMENT '中转装车地' AFTER `transfer_addr_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_transfer_demand_info dptd, base_addr ba set dptd.addr_name = ba.addr_name where dptd.base_addr_id = ba.id;
update dp_transfer_demand_info dptd, base_addr ba set dptd.transfer_addr_name = ba.addr_name where dptd.transfer_addr_id = ba.id;
update dp_transfer_demand_info dptd, receive_info r set dptd.short_name = r.short_name where dptd.receive_id = r.id;
-- ----------------------------
-- 2018-09-06 更新
-- ----------------------------
ALTER TABLE `dp_demand_info`
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_demand_info dpd, base_addr ba set dpd.addr_name = ba.addr_name where dpd.base_addr_id = ba.id;
update dp_demand_info dpd, receive_info r set dpd.short_name = r.short_name where dpd.receive_id = r.id;
-- ----------------------------
-- 2018-09-07 更新
-- ----------------------------
ALTER TABLE `dp_task_stat`
ADD COLUMN `route_start`  varchar(50) NULL COMMENT '起始地城市' AFTER `route_start_id`,
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `route_end`  varchar(50) NULL COMMENT '目的地城市' AFTER `route_end_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_task_stat dpts, city_info c,city_info c1 set dpts.route_start = c.city_name ,dpts.route_end = c1.city_name where dpts.route_start_id = c.id and dpts.route_end_id = c1.id;
update dp_task_stat dpts, base_addr ba set dpts.addr_name = ba.addr_name where dpts.base_addr_id = ba.id;
update dp_task_stat dpts, receive_info r set dpts.short_name = r.short_name where dpts.receive_id = r.id;
-- ----------------------------
-- 2018-09-07 更新
-- dp_task_stat追加route_start,addr_name,route_end,short_name字段
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_demand_stat`;
DELIMITER ;;
CREATE TRIGGER `trg_new_demand_stat` AFTER INSERT ON `dp_demand_info` FOR EACH ROW INSERT INTO
dp_task_stat(route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end,receive_id,short_name,date_id,pre_count)
VALUES (new.route_start_id,new.route_start,new.base_addr_id,new.addr_name,new.route_end_id,new.route_end,new.receive_id,new.short_name,new.date_id,new.pre_count)
ON DUPLICATE KEY UPDATE pre_count = pre_count+ new.pre_count ,task_stat_status=1;
;;
DELIMITER ;
-- ----------------------------
-- 2018-09-13 更新
-- ----------------------------
ALTER TABLE `damage_check_indemnity`
ADD COLUMN `contacts_name`  varchar(50) NULL COMMENT '联系人' AFTER `plan_money`,
ADD COLUMN `tel`  varchar(20) NULL COMMENT '联系电话' AFTER `contacts_name`;
-- ----------------------------
-- 2018-09-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '门卫费' AFTER `clean_fee`;
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '门卫费' AFTER `total_price`;
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `actual_guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '实际门卫费' AFTER `guard_fee`;
-- ----------------------------
-- 2018-09-14 更新
-- ----------------------------
ALTER TABLE `truck_dispatch`
ADD COLUMN `truck_number`  tinyint(2) NULL DEFAULT 0 COMMENT '板车位数' AFTER `truck_id`;
update truck_dispatch td inner join(select t.id,t1.number from truck_info t left join truck_info t1 on t.rel_id = t1.id ) t on td.truck_id = t.id set td.truck_number = if(isnull(t.number),0,t.number);
-- ----------------------------
-- Table structure for entrust_make_rel
-- ----------------------------
DROP TABLE IF EXISTS `entrust_make_rel`;
CREATE TABLE `entrust_make_rel` (
  `entrust_id` int(10) NOT NULL COMMENT '委托方ID',
  `make_id` int(10) NOT NULL COMMENT '品牌ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`entrust_id`,`make_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-09-21 更新
-- ----------------------------
ALTER TABLE `drive_peccancy`
ADD COLUMN `date_id`  int(4) NULL COMMENT '违章统计时间' AFTER `op_user_id`;
update drive_peccancy set date_id = DATE_FORMAT(created_on,'%Y%m%d')
-- ----------------------------
-- 2018-09-21 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `date_id`  int(4) NULL COMMENT '超油统计时间' AFTER `op_user_id`;
update drive_exceed_oil set date_id = DATE_FORMAT(created_on,'%Y%m%d')