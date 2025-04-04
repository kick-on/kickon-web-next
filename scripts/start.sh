#!/bin/bash
cd /home/ubuntu/web-nextjs-service

# PM2 실행 (sudo 사용)
pm2 delete my-front-app --silent || true
pm2 start yarn --name "my-front-app" -- start
pm2 save