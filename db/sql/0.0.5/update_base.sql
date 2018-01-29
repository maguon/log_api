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
CHANGE COLUMN `collect_status` `status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '领取状态(0-取消 ,1-未审核,2-已通过,3-未领取,4-已领取)' AFTER `date_id`;
ADD COLUMN `clean_date`  datetime NULL COMMENT '领取时间' AFTER `drive_user_id`;