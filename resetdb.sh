#!/bin/sh
if [ -z $1 ]; then
	DATABASE="recon_dev"
else
	DATABASE=$1
fi
echo $DATABASE
psql -Upostgres -c"drop schema public cascade" $DATABASE
psql -Upostgres -c"create schema public" $DATABASE
