#!/bin/bash
source /etc/profile
# Jenkins传入的环境变量
ENV=$1
# 默认node环境9.11.0,当前项目指定10.22.0的node版本
nvm use --delete-prefix v10.22.0
npm -v
npm config set registry http://npm.eslink.cc/
npm config get registry

npm install

echo "构建环境：$ENV";
if [[ $ENV == "dev"  ]]; then
    npm run build
elif [[ $ENV == "test" ]]; then
	# 测试环境
	npm run build
elif [[ $ENV == "product" ]]; then
	# 生产环境
	npm run build
fi
