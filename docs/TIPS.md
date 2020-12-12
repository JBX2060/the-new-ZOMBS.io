# TIPS

This file gives some tips
while making this project.

## Using git
Commits need to start by either [fix], [feature] or [other]. They also need to be written in correct english.
Please push after having tested all your current commits, making sure they work, so you don't commit a fix in the following minute.

## For production
In production, you will need to build `client` and `server`.
For this, you can use the following commands: `yarn build:client`
and `yarn build:server`. Once it's done, you can start them
using `yarn production:client` and `yarn production:server`.
This will start `pm2` processes, which will run in background.
You may use `pm2 startup` for them to run automatically on boot.
To start API, you need to run it within a python virtualenv. To create
one, switch current directory to `src/api`. Then, use
`python -m venv env` and activate it using `source env/bin/activate`.
Finally, run `yarn production:api`. Last step is to enable nginx.
The configuration is at `../nginx.conf`. You may need to change it
a little bit, for proper SSL certifcates locations, and right hostname.
When you're done, enable the configuration by making a copy of the file
to `/etc/nginx/sites-available` and symlink it to `/etc/nginx/sites-enabled`.
Make sure `/etc/nginx/nginx.conf` has a `include /etc/nginx/sites/enabled/*`
line. Reload nginx using `sudo nginx -s reload`, and that's it.
