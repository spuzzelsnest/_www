#!/bin/bash
echo "Installing Certification \n"
mkdir -p ../cert

openssl genrsa -des3 -out ../cert/https.key 2048
openssl req -new -key ../cert/https.key -out ../cert/https.csr
openssl x509 -req -days 365 -in ../cert/https.csr -signkey ../cert/https.key -out ../cert/https.crt



echo "Changing Permissions \n"

chmod 755 ../cert
chmod 700 ../cert/*.key
chown $USER:www-data -R ../*


echo "donwloading Markers \n"

mkdir ../public/img

wget http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Azure-icon.png -O ../public/img/marker1.png
wget http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Chartreuse-icon.png -O ../public/img/marker2.png
wget http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Pink-icon.png -O ../public/img/marker3.png

echo "Installation Done"
