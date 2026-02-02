#!/bin/bash

# 공통 환경변수 로드
source "$(dirname "$0")/env-config.sh"

# 프로젝트 폴더로 이동
cd "$PROJECT_ROOT"

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# PM2 재시작
pm2 delete "$APPLICATION_NAME" --silent || true
pm2 start ecosystem.config.cjs
pm2 save
