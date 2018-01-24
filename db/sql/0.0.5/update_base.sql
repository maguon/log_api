-- ----------------------------
-- 2018-01-24 更新
-- ----------------------------
ALTER TABLE `log_base`.`car_info` ADD COLUMN `order_date_id` int(4) AFTER `order_date`;
ALTER TABLE `log_base`.`receive_info` CHANGE COLUMN `clean_fee` `clean_fee` decimal(10,2) DEFAULT 0 COMMENT '洗车费';
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `dp_route_task_id` int(10) NOT NULL AFTER `id`;
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `actual_price` decimal(10,2) UNSIGNED COMMENT '实际费用' AFTER `total_price`;