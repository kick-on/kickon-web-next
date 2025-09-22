#!/bin/bash

# 배포 디렉토리 초기화
sudo rm -rf /home/ubuntu/web-nextjs-service/*

# 권한 설정
sudo chown -R ubuntu:ubuntu /home/ubuntu/web-nextjs-service
