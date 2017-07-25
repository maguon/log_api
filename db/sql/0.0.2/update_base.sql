ALTER TABLE `drive_info`
ADD COLUMN `confirm_date`  datetime NULL COMMENT '检证时间' AFTER `license_type`,
ADD COLUMN `address`  varchar(200) NULL COMMENT '家庭住址' AFTER `confirm_date`,
ADD COLUMN `sib_tel`  varchar(20) NULL COMMENT '家属电话' AFTER `address`;
ALTER TABLE `truck_insure_rel`
ADD COLUMN `active`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '默认-1' AFTER `insure_status`,
ADD COLUMN `date_id`  int(4) NOT NULL AFTER `active`;