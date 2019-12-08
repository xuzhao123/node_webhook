#!/bin/sh

echo 'publish start'

work_dir=`pwd`
env="$1"
publicPath="$2"

echo '更新博客'

# 更新博客
if [ ! -d "./blog" ]; then
    git clone https://github.com/xuzhao123/blog.git
else 
    cd ./blog
    git pull origin master
fi

cd $work_dir

echo '更新hexo程序'

# 更新hexo程序
if [ ! -d "./hexo-blog" ]; then
    git clone https://github.com/xuzhao123/hexo-blog.git
else 
    cd ./hexo-blog
    git pull origin master
fi

cd $work_dir

if [ ! -d "./hexo-blog/node_modules" ]; then
    cd ./hexo-blog
    npm install
fi

cd $work_dir

echo '复制md文件'

# 复制md文件
cp -r `find ./blog/ -name *.md` hexo-blog/source/_posts

cd ./hexo-blog

npx hexo generate

echo '生成博客代码'

mv ./public/* "${publicPath}"

rm -rf ./pulic

echo 'publish done'
