-- ----------------------------
-- 2018-09-04 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`,
ADD COLUMN `transfer_addr_name`  varchar(50) NULL COMMENT '中转装车地' AFTER `transfer_addr_id`;
update dp_route_load_task dprl, base_addr ba set dprl.addr_name = ba.addr_name where dprl.base_addr_id = ba.id;
update dp_route_load_task dprl, base_addr ba set dprl.transfer_addr_name = ba.addr_name where dprl.transfer_addr_id = ba.id;
update dp_route_load_task dprl, receive_info r set dprl.short_name = r.short_name where dprl.receive_id = r.id;