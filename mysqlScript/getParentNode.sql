use webdisk;
DELIMITER $$
DROP FUNCTION 
IF EXISTS GET_PARENT_NODE $$ 
CREATE FUNCTION `GET_PARENT_NODE`(rootId varchar(100),userid varchar(100))   
RETURNS varchar(1000) READS SQL DATA
BEGIN   
DECLARE fatherId varchar(100) default "";
DECLARE str varchar(1000) default rootId;   
  
WHILE rootId != '/' do   
    SET fatherId =(SELECT did FROM dirs WHERE id = rootId && uid = userid);   
    IF fatherId !='/' THEN   
        SET str = concat(fatherId, ',', str);   
        SET rootId = fatherId;   
    ELSE   
        SET rootId = fatherId;   
    END IF;   
END WHILE;   
return str;  
END $$
DELIMITER ;