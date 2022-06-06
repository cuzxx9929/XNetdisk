CREATE TABLE `webdisk`.`users` (
  `uid` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE INDEX `uid_UNIQUE` (`uid` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE `webdisk`.`dirs` (
  `id` VARCHAR(255) NOT NULL,
  `dirname` VARCHAR(255) NOT NULL,
  `did` VARCHAR(255) NOT NULL,
  `time` VARCHAR(255) NOT NULL,
  `uid` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

CREATE TABLE `webdisk`.`files` (
  `fid` VARCHAR(255) NOT NULL,
  `uid` VARCHAR(255) NOT NULL,
  `did` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `size` VARCHAR(255) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `time` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`fid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;
