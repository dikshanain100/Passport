FROM node:16

# Create app directory : on Docker
RUN mkdir -p /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./
COPY package.json package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build --prod
# Helpful command 
# WORKDIR /app/otherfolder //whenever you want to go inside a folder and want to run some command
# WORKDIR /app    ///coming back to parent folder
# RUN npm run build --prefix ./fusion -- --base-href ='./'
# Run npm run build --prefix ./myServices
# CMD [ "node", "index.js" , "-d"]
# CMD [ "ng ", "serve" , "--host", "0.0.0.0","--port", "443"]

EXPOSE 4200

# Don't verify connected clients are part of allowed hosts
CMD /usr/src/app/node_modules/.bin/ng serve --host 0.0.0.0 --disableHostCheck


# WORKDIR /usr/src/app/node_modules/.bin/ //not working
# CMD [ "ng ", "serve"]   //not working
# CMD [ "ng ", "serve" , "--host", "127.0.0.1","--port", "4200"]