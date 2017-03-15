

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(50) DEFAULT NULL COMMENT '用户密码',
  `role_id` int(11) DEFAULT NULL COMMENT '角色ID',
  `mobile` varchar(50) DEFAULT NULL COMMENT '手机号',
  `status` char(1) DEFAULT '1' COMMENT '状态',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增唯一ID',
  `dept_name` varchar(50) DEFAULT NULL COMMENT '部门名称',
  `tel` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for drive_info
-- ----------------------------
DROP TABLE IF EXISTS `drive_info`;
CREATE TABLE `drive_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `drive_name` varchar(50) DEFAULT NULL COMMENT '司机姓名',
  `ascription_type` varchar(50) DEFAULT '1' COMMENT '所属类型（1-自营,2-承包,3-供方,4-外协）',
  `drive_type` varchar(50) DEFAULT '1' COMMENT '司机所属类型（1-板车司机,2-短驳司机）',
  `drive_status` varchar(50) DEFAULT '1' COMMENT '司机状态(0-在途,1-待运,2-休息)',
  `license_level` varchar(50) DEFAULT NULL COMMENT '驾驶证级别',
  `license_date` datetime DEFAULT NULL COMMENT '驾驶证到期日期',
  `license_image` varchar(100) DEFAULT NULL COMMENT '驾驶证照片',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for truck_info
-- ----------------------------
DROP TABLE IF EXISTS `truck_info`;
CREATE TABLE `truck_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `truck_num` varchar(50) DEFAULT NULL COMMENT '车牌号或挂车号',
  `brand` varchar(50) DEFAULT NULL COMMENT '品牌',
  `truck_tel` varchar(50) DEFAULT NULL COMMENT '随车电话',
  `the_code` varchar(50) DEFAULT NULL COMMENT '车辆识别代码（头车/挂车车架号）',
  `operate_type` varchar(50) DEFAULT '1' COMMENT '运营类型（1-自营,2-承包,3-供方,4-外协）',
  `truck_type` varchar(50) DEFAULT '1' COMMENT '车辆类型（1-车头,2-挂车）',
  `truck_status` varchar(50) DEFAULT '0' COMMENT '当前状态(0-可用,1-使用中,2-维修中,3-报废)',
  `number` varchar(50) DEFAULT NULL COMMENT '板车位数',
  `driving_image` varchar(100) DEFAULT NULL COMMENT '行驶证照片',
  `operation_image` varchar(100) DEFAULT NULL COMMENT '营运证照片',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(50) DEFAULT NULL COMMENT '用户密码',
  `role_id` int(11) DEFAULT NULL COMMENT '角色ID',
  `dept_id` int(11) DEFAULT NULL COMMENT '部门ID',
  `gender` char(1) DEFAULT '1' COMMENT '性别',
  `tel` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `mobile` varchar(50) DEFAULT NULL COMMENT '手机号',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `status` char(1) DEFAULT '1' COMMENT '状态',
  `last_login_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) DEFAULT NULL COMMENT '角色名称',
  `role_sort` varchar(200) DEFAULT NULL COMMENT '角色排序号',
  `func_id_str` varchar(10000) DEFAULT NULL COMMENT '角色对应的功能ID串',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
