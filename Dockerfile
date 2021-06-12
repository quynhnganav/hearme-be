FROM node

WORKDIR /var/www/html

COPY . /var/www/html

RUN npm i -g @nestjs/cli
RUN npm i

# Development
CMD ["npm", "run", "start:dev"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]