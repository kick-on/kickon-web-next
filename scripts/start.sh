#!/bin/bash

# 인자로 환경 선택 (default: production)
ENV=${1:-production}

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/web-nextjs-service

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 앱 이름과 포트 결정
if [ "$ENV" = "development" ]; then
    APP_NAME="my-front-app-dev"
    PORT=3001
else
    APP_NAME="my-front-app-prod"
    PORT=3000
fi

# 기존 pm2 프로세스 삭제
pm2 delete "$APP_NAME" --silent || true

# pm2 실행
pm2 start node_modules/next/dist/bin/next --name "$APP_NAME" -- start -p $PORT

# pm2 상태 저장
pm2 save
