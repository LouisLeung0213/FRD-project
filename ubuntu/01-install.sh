set -e
set -x

sudo apt update
sudo apt install --yes nginx
sudo apt install --yes python3-certbot-nginx

echo "please setup /etc/nginx/sites-available and sites-enabled..."
echo "remember to run 'sudo service nginx restart' after chaning nginx config..."
echo "please run 'sudo certbot' to obtain https cert..."

