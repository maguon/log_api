delimiter $$
create trigger trg_create_storage_stat
after insert on storage_info for each row
BEGIN
insert into storage_stat_date(date_id,storage_id)
values(DATE_FORMAT(CURRENT_DATE(),'%Y%m%d'),new.id);
END $$
delimiter ;