-- ----------------------------
-- 2018-07-19 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `receive_type`  tinyint(1) NULL DEFAULT 1 COMMENT '经销商类型(1-4S店,2-大客户,3-临时停放地)' AFTER `receive_name`;
-- ----------------------------
-- 2018-07-24 更新
-- ----------------------------
ALTER TABLE `settle_handover_info`
ADD COLUMN `serial_number`  int(10) NULL COMMENT '序号' AFTER `number`;