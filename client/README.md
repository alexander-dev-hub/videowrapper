frontend VPS
http://159.65.225.148:3000

- installation
npm install
npm start
npm run build
pm2 start server.js --max-memory-restart 1024M

- nginx setting
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
    ssl_certificate /etc/letsencrypt/live/wrapr.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wrapr.io/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Diffie-Hellman parameter for DHE ciphersuites, recommended 2048 bits
    # ssl_dhparam /path/to/dhparam.pem;

    # Include the SSL configuration from cipherli.st
    # include snippets/ssl-params.conf;

    resolver 8.8.8.8;

    server_name api.wrapr.io;
    root /mnt/new-videowrapper/client;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_pass http://127.0.0.1:5000/;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }
}