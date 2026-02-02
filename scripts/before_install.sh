#!/bin/bash

# 공통 환경변수 로드
source "$(dirname "$0")/env-config.sh"

# 배포 디렉토리 초기화
sudo rm -rf "$PROJECT_ROOT"
sudo mkdir -p "$PROJECT_ROOT"

# 권한 설정
sudo chown -R ubuntu:ubuntu "$PROJECT_ROOT"
