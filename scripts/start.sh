#!/bin/bash
cd /home/ubuntu/web-nextjs-service

# PM2 실행 (sudo 사용)
sudo pm2 delete my-front-app --silent || true
sudo pm2 start yarn --name "my-front-app" -- start
sudo pm2 save