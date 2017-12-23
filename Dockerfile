FROM node:6.10.1

MAINTAINER Hossam Ahmed <hossam.elfar95@gmail.com>

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --pure-lockfile

# copy all file from current dir to /app in container
COPY . /app

# run the app using pm2 
RUN npm install pm2 -g

# expose port 8080
EXPOSE 8080

# # cmd to start service
# CMD ["pm2-docker", "index.js", "-i", "4"]