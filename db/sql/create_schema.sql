CREATE SCHEMA `log_base` ;
CREATE USER 'log'@'%' IDENTIFIED BY 'logbase';

GRANT ALL privileges ON log_base.* TO 'log'@'%'IDENTIFIED BY 'logbase';