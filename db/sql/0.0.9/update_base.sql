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