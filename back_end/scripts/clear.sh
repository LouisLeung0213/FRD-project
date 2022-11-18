set -e
set -o pipefail


## remove old containers
docker ps -a | grep -v docker-postgres | grep Exited | awk '{print $1}' | xargs docker rm

## remove old images
docker images | grep none | awk '{print $3}' | xargs docker rmi

 