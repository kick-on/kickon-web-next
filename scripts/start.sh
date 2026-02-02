#!/bin/bash

# 프로젝트 디렉토리 분기
BASE_PATH="/home/ubuntu"

if [[ "$APPLICATION_NAME" == *"prod"* ]]; then
    TARGET_DIR="web-nextjs-prod-service"
else
    TARGET_DIR="web-nextjs-dev-service"
fi

# 프로젝트 디렉토리로 이동
cd "$BASE_PATH/$TARGET_DIR"

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# PM2 재시작
pm2 delete "$APPLICATION_NAME" --silent || true
pm2 start ecosystem.config.cjs
pm2 save
