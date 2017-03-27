#!/bin/bash
#This script is used to complete the process of build staging

npm install
if [[ $? -eq 0 ]];
then
echo forever -a start main.js ;
fi
