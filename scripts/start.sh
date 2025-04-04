#!/bin/bash

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/web-nextjs-service

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# PM2 재시작
pm2 delete my-front-app --silent || true
pm2 start yarn --name "my-front-app" -- start
pm2 save