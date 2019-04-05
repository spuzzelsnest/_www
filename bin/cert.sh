#!/bin/bash

mkdir -p ../cert

openssl genrsa -des3 -out ../cert/https.key 2048
openssl req -new -key ../cert/https.key -out ../cert/https.csr
openssl x509 -req -days 365 -in ../cert/https.csr -signkey ../cert/https.key -out ../cert/https.crt


chmod 755 ../cert
chmod 700 ../cert/*.key
