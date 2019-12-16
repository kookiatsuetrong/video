drop database if exists webschool;
create database webschool default charset 'UTF8';
drop user if exists james;
create user james identified with mysql_native_password by 'bond';
grant all on webschool.* to james;

use webschool;
create table lesson
(
  id          int unique not null auto_increment,
  title       varchar(200),
  detail      varchar(1000),
  link        varchar(1000),
  type        varchar(200) default 'free',
  material    varchar(1000)
);
insert into lesson(title, detail, link)
  values('Introduction to English for Engineer',
            '...',
            'intro.mp4');
            
insert into lesson(title, detail, link)
  values('A Tour of the Workplace',
            '...',
            'tour.mp4');
