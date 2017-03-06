

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
  `status` char(1) DEFAULT '1' COMMENT '状态',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户USER_NAME',
  `time` datetime DEFAULT NULL COMMENT '记录时间',
  `ip` varchar(20) DEFAULT NULL COMMENT 'IP地址',
  `log_type` char(1) DEFAULT '1' COMMENT '日志类型',
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `real name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(50) DEFAULT NULL COMMENT '用户密码',
  `role_id` int(11) DEFAULT NULL COMMENT '角色ID',
  `dept_id` int(11) DEFAULT NULL COMMENT '部门ID',
  `sex` char(1) DEFAULT '1' COMMENT '性别',
  `tel` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `mobile` varchar(50) DEFAULT NULL COMMENT '手机号',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `status` char(1) DEFAULT '1' COMMENT '状态',
  `last_login_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `not_login` char(1) DEFAULT '1' COMMENT '禁止登录系统(0-禁止,1-不禁止)',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_online
-- ----------------------------
DROP TABLE IF EXISTS `user_online`;
CREATE TABLE `user_online` (
  `uid` int(11) NOT NULL COMMENT '在线人员UID',
  `time` datetime DEFAULT NULL COMMENT '更新时间',
  `sid` varchar(50) DEFAULT NULL COMMENT '在线人员SessionID',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
