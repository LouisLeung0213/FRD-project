FROM --platform=linux/amd64 node:18.12.1-slim
WORKDIR /usr/src/toystory
COPY package.json .
RUN npm install
COPY dist dist
COPY scripts/prod-run.sh scripts/
CMD bash scripts/prod-run.sh