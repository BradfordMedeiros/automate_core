

FROM node:9.2.0

WORKDIR /automate
ADD . .

# Install project npm dependencies
wget https://archive.raspbian.org/raspbian/pool/main/g/gcc-4.7/libstdc++6_4.7.2-5%2Brpi1_armhf.deb
dpkg-deb -x libstdc++6_4.7.2-5%2brpi1_armhf.deb /
dpkg -i --force-all libstdc++6_4.7.2-5%2brpi1_armhf.deb

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


