CREATE SCHEMA `log_base` ;
CREATE USER 'log'@'%' IDENTIFIED BY 'log_base';

GRANT ALL privileges ON log_base.* TO 'log'@'%'IDENTIFIED BY 'log_base';