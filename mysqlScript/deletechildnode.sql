use webdisk;
set sql_safe_updates=0;
DELIMITER $$
DROP FUNCTION IF EXISTS DELETE_CHILD_NODE $$ 
CREATE FUNCTION `DELETE_CHILD_NODE`(rootId varchar(100),userid varchar(100))   
RETURNS varchar(2000) DETERMINISTIC 
BEGIN  
DECLARE str varchar(2000);  
DECLARE cid varchar(2000); 
DECLARE paths varchar(2000);  
SET str = '$';   
SET cid = rootId;
WHILE cid is not null DO      
	SET str = concat(str, ',', cid);  
    SELECT group_concat(id) INTO cid FROM dirs where FIND_IN_SET(did, cid) && uid = userid;
END WHILE; 

delete from dirs where FIND_IN_SET(id,str) && uid = userid;
select group_concat(path) into paths from files where FIND_IN_SET(did,str) && uid = userid;
delete from files where FIND_IN_SET(did,str) && uid = userid;
RETURN paths;   
END$$
DELIMITER ;
