#!/bin/bash

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/web-nextjs-service

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# ENV 환경 변수 확인 (AWS CLI 배포에서 전달됨)
ENV=${ENV:-production}  # ENV가 없으면 기본 production

# ENV에 따라 pm2 앱 이름 결정
if [ "$ENV" = "development" ]; then
  APP_NAME="my-front-app-dev"
else
  APP_NAME="my-front-app-prod"
fi

# PM2 재시작
pm2 delete "$APP_NAME" --silent || true
pm2 start ecosystem.config.cjs --only "$APP_NAME"
pm2 save
