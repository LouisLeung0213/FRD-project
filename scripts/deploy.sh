set -e
set -x

server="toystory"

cd back_end
rm -rf dist
nest build
./scripts/build-image.sh
cd ..

docker images web-server:latest

## Export and Upload Image in one pass
# docker save web-server:latest \
#   | pv \
#   | zstd \
# 	| ssh $server "
# 	  unzstd | docker load
# 	"

## Export image, then upload with rsync to allow skipping if the image is unchanged
docker save web-server:latest \
  | pv \
  | zstd \
  > image.zst
rsync -SavLP image.zst $server:~/toystory/
ssh $server "
  cd toystory && \
  cat image.zst | unzstd | docker load
"

rsync -SavLP docker-compose.yml $server:~/demo/
ssh $server "
  cd toystory && \
  docker-compose up -d
"
