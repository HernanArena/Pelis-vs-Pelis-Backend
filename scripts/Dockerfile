FROM mysql:5.7.15

MAINTAINER Hernán Arena

ENV MYSQL_DATABASE=competencias \
    MYSQL_ROOT_PASSWORD=pegasus8039

ADD schema.sql /docker-entrypoint-initdb.d

EXPOSE 3306
