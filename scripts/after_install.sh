#!/bin/bash

# 프로젝트 디렉토리로 이동
cd /home/ubuntu/web-nextjs-service

# nvm 환경 설정
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# node_modules 생성
yarn install --production
