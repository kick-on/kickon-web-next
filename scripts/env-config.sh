#!/bin/bash

BASE_PATH="/home/ubuntu"

if [[ "$APPLICATION_NAME" == *"prod"* ]]; then
    TARGET_DIR="web-nextjs-prod-service"
else
    TARGET_DIR="web-nextjs-dev-service"
fi

export PROJECT_ROOT="$BASE_PATH/$TARGET_DIR"
