# CLOUDFLARE

As we will be using Cloudflare,
this file contains some important
notes for it.

## DNS records
If we are in BETA, we will need to redirect
all queries from `zombia.io` to `beta.zombia.io`,
so that the user knows he's using the BETA.
This can be done with a simple CNAME record:
```
zombia.io. CNAME beta.zombs.io.
```

Make sure having an A record pointing
to our VPS' IP address:
```
zombia.io. A <ip_address>.
```

Make sure to point website to port 22926,
API to port 22926 and game to port 22927:
```
_web._tcp.zombia.io. 86400 IN SRV 0 40 22926 zombia.io.
_game._tcp.zombia.io. 86400 IN SRV 0 40 22927 fr01.zombia.io.
_api._tcp.zombia.io 86400 IN SRV 0 20 22926 api.zombia.io.
```
