FROM node:latest
COPY . .
RUN npm i
RUN npm install pm2@latest -g
EXPOSE 5000
CMD pm2-runtime start npm -- start
# If you want to enable this instead of using pm2, change react-scripts version in package.json to 3.4.0
#CMD npm start
