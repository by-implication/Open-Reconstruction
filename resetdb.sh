#!/bin/sh
if [ -z $1 ]; then
	DATABASE="recon_dev"
else
	DATABASE=$1
fi
echo $DATABASE
psql -Upostgres $DATABASE -c"drop schema public cascade"
psql -Upostgres $DATABASE -c"create schema public"
