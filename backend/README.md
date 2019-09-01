backend VPS
http://159.65.225.148:3001

- server must be linux(Ubuntu)

- installation
install node node > 10
install ffmpeg
install imageMagick
npm install
pm2 start server.js --max-memory-restart 1024M

- reset email setting
reference url: https://itnext.io/password-reset-emails-in-your-react-app-made-easy-with-nodemailer-bb27968310d7

There’s an extra gotcha to be aware of when setting up the transporter email that all the emails are sent from, at least, when using Gmail.
1. 2-Step verification must be disabled
2. setting titled ‘Allow less secure apps’ must be toggled to on

- stripe setting
https://dashboard.stripe.com
1. create one product for this application, naming does not matter(e.g. videowrappr).
2. create three pricing plans
        plan detail:        metadata:           metadata:
plan1   monthly($9.97)      cycleSign: mo       description: No watermark
plan2   6 month($48)        cycleSign: 6-mo     description: No watermark, It works out at $8 Per Month
plan3   yearly($64)         cycleSign: 12-mo    description: No watermark, It works out at $7 Per Month
3. catch that product id(e.g. prod_F0tDOTaJQc4HGf) and stripe secret key(e.g. sk_test_P5n9Nv9ZKEJccHHLfnKK3v3a) and set them in config.json. (stripe variables should go to dotenv and get git ignored under standard for security)
4. configure the settings
https://dashboard.stripe.com/account/billing/automatic
custom: Manage failed payments/Retry schedule/Retry up to 4 times within -> 1 week
custom: Manage failed payments/Customer emails/Send emails when payments fail -> true
strict: Manage failed payments/Subscription status/If all retries for a payment fail -> cancel the subscription
* https://dashboard.stripe.com/settings -> invite team memeber
5. webhook setting
https://dashboard.stripe.com/{livemode -> test or live}/webhooks -> add webhook endpoint to stripe account from config.json and web hostname
webhook endpoint looks like -> https://{backend hostname}/api/stripe-listen-webhook
set webhook signing secret in config.json caught from stripe account developers/webhooks
confirm webhook setting by sending test webhook... and checking response on stripe account
limit webhook events to necessary events in business logic, make sure you only send events that you actually want to process on your API (e.g. customer.subscription.deleted, customer.subscription.updated)

event list
customer.subscription.deleted -> https://stripe.com/docs/billing/subscriptions/canceling-pausing
customer.subscription.updated -> https://stripe.com/docs/billing/subscriptions/payment -> past_due search

for refund and dispute, we can downgrade user manually using some UI or use webhooks
no, it has no service members, so at least for refund and dispute we should be able to downgrade their roles to free trial in webhook
"charge.dispute.funds_reinstated":
"charge.dispute.funds_withdrawn"
"charge.dispute.funds_updated"
"charge.dispute.funds_closed"
"charge.dispute.created"
"charge.refunded"

- backend api test endpoint
http://159.65.225.148:3001/api/check-reset-password

- backend nginx setting
https://www.youtube.com/watch?v=kR06NoSzAXY

sudo nano /etc/nginx/sites-enabled/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # Redirect all HTTP requests to HTTPS with a 301 Moved Permanently response.
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # certs sent to the client in SERVER HELLO are concatenated in ssl_certificate
    ssl_certificate /etc/letsencrypt/live/api.wrapr.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.wrapr.io/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Diffie-Hellman parameter for DHE ciphersuites, recommended 2048 bits
    # ssl_dhparam /path/to/dhparam.pem;

    # Include the SSL configuration from cipherli.st
    # include snippets/ssl-params.conf;

    resolver 8.8.8.8;

    server_name api.wrapr.io;
    root /mnt/d/new-videowrapper/backend;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_pass http://127.0.0.1:3001/;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }

    location /file-server/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_pass http://127.0.0.1:3010/;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }
}

sudo nano /etc/nginx/nginx.conf
# set client body size to 5122M # for 413 status code resolution
client_max_body_size 512M;

mongo
user videowrapper
db.createUser({user: 'admin', pwd: 'admin', roles: [{role: 'readWrite', db: 'yourDB'}]})

sudo nano /etc/mongod.conf
# network interfaces
net:
 port: 27017
 bindIp: 127.0.0.1,159.65.225.148
 security:
 authorization: enabled

# local path
 /mnt/e/07_development/paul-lynch/02_project/new-videowrapper/backend

- admin account
email: admin@wrapr.io
password: admin123456
