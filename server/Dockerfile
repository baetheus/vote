#Grab the latest alpine image
FROM alpine:latest

# Install python and pip
RUN apk add --no-cache --update nodejs npm

# Add our code
ADD ./server /opt/
WORKDIR /opt/server

# Build server
RUN npm ci
RUN npm run build:server

# Run the image as a non-root user
RUN adduser -D express
USER express

# Run the app			
CMD node build/server/main.js

