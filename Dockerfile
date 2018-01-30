

FROM node:9.2.0

WORKDIR /automate
ADD . .

# Install project npm dependencies
RUN mkdir databases/dbs
RUN npm install

# mqtt broker
EXPOSE 1883
# mqtt http (different connection type)
EXPOSE 4001	

# main http server
EXPOSE 9000

# http proxy (for convenience)
EXPOSE 4000



CMD ["node","index.js"]


