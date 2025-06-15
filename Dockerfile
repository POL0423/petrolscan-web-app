#################################################################
# PetrolScan - A web application for comparing fuel prices
# Created by: Marek Poláček (POL0423)
# License: MIT License
# This file is part of the PetrolScan project.
#
# File: Dockerfile
# Description:  Dockerfile for building and serving 
#               the PetrolScan web application.
#################################################################

ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD

# Stage 1: Build
FROM node:latest AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:alpine
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
EXPOSE 3000
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm install next

CMD ["npm", "start"]
