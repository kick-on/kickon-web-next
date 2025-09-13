#!/bin/bash
set -e  # 에러 발생 시 즉시 종료

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/web-nextjs-service

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# 기존 node_modules 삭제 후 lockfile 기반 설치
rm -rf node_modules
yarn install --frozen-lockfile

# 기존 .next 삭제 후 재빌드
rm -rf .next
yarn build

# pm2 재시작
pm2 delete my-front-app --silent || true
pm2 start yarn --name "my-front-app" -- start
pm2 save