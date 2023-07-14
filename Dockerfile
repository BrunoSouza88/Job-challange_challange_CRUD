FROM mysql:8.0

ENV MYSQL_DATABASE todolist
ENV MYSQL_USER=root
ENV MYSQL_ROOT_PASSWORD password_test

COPY setup.sql /docker-entrypoint-initdb.d/
