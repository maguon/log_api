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