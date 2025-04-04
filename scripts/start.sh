#!/bin/bash
cd /home/ubuntu/web-nextjs-service

#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# PM2 실행 (sudo 사용)
pm2 delete my-front-app --silent || true
pm2 start yarn --name "my-front-app" -- start
pm2 save