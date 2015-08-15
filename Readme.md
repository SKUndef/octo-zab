# OctoZab

![Alt text](resources/images/demo.png "Demo Example")

This application is a backend/frontend system to remotely control multiple Zabbix servers (http://www.zabbix.com/).

Demo: [here](http://demo.quadrata.it/octozab/)


## Features

- Issues list sorted by Severity -> Last Change
- Issues treemap overview, with drilldown per server
- Dynamic filtering on issues list through interaction with treemap objects
- Redirect to issue details from issues list
- NEW! Zabbix servers configuration management, ability to add, remove and choose credentials!
- NEW! Notification to all connected users on configuration changes (like the servers one)


## Dependencies

- [NodeJS](http://nodejs.org/)	tested >= 0.12.6
- [Redis](http://redis.io/)		tested >= 3.0.2


## How does it work

Backend is made by a NodeJS server, that operates in order to authenticate Zabbix servers and communicate with APIs they expose. Collected data is then stored on Redis DB, that caches it. Redis keys are monitored by the server in order to send changes back to client frontends whenever they occur. Clients are connected to server through WebSockets.

## Docker Container

An easy and fast way to test the application is using our Docker container. Install [docker](https://docs.docker.com/) on your machine, pull the image and run it:

```shell
docker pull quadrata/octozab
docker run -it -d -p $frontendHostPort:80 -p $backendHostPort:8080 --name="octoZab" quadrata/octozab
```

where $frontendHostPort and $backendHostPort are ports on your host where you desire that frontend and backend respectively should run. Now you have to configure the container. Attach to it and start necessary services:

```shell
docker attach octoZab
```

```shell
service httpd start
service octozab-redis start
service octozab-node start
```

Modify frontend `"/var/www/html/octozab/config.js"` with your host url and host backend port you defined above at container run.

IMPORTANT! When we speak about host, it is meant host, not the container. So above with $frontendHostPort and $backendHostPort we were referring to host ports on which are mapped container ports. And with host url in "config.js" we mean the url on which you access your host, not the container.

Then detach from container with Ctrl+P-Ctrl+Q.


That's it! Now you should be able to connect to application browsing at `http://yourHostUrl:yourHostFrontendPort/octozab` (if you mapped container port 80, webserver one, with port 80 on your host, you can omit the `:yourHostFrontendPort` url part).


## Installation

In order to test the application, first step is to install dependencies listed above. Once `node`, `npm`, `redis-server` and `redis-cli` executables are installed on server, you can start deploying both backend and frontend by cloning repository on webserver root.

If you prefer to deploy backend and frontend on different machines, copy only `"backend"` folder on backend machine, and the rest of the repository on frontend machine. Then modify in the file `"config.js"` the `backendUrl` parameter with backend domain name. Be sure port `8080` is exposed to frontend from backend.

Install NodeJS module dependencies. Move from command-line to backend folder and run following command:

```shell
npm install
```

Frontend is based on ExtJS framework. In order to make the source code work, you have first to install SenchaCmd tool version [5.0.0.160](http://cdn.sencha.com/cmd/5.0.0.160/SenchaCmd-5.0.0.160-linux-x64.run.zip) (link is for Linux 64bit version). Check SenchaCmd dependencies [here](http://docs.sencha.com/cmd/5.x/intro_to_cmd.html#System_Setup) (Java >=1.7, Ruby >=2.0.0, Compass).
Then from command-line move to frontend folder, and give the following commands:

```shell
sencha app upgrade
sencha app build
```

Now run backend services. The simplest way is to open separate shells for Redis DB:

```shell
redis-server $backend/redis.conf
```

and NodeJS server:

```shell
node $backend/server.js
```

where `$backend` is the path to `"backend"` folder deployed before.


## Usage

To see OctoZab in action, it's enough to connect to frontend, based on where you deployed frontend source code. To edit a Zabbix server details (url, user, psw, ...) from related settings, and __double click on corresponding row__.

If you're not using Docker container and you want to have a production release of it, use the SenchaCmd tool. Move from command-line to frontend folder, and run:

```shell
sencha app build
```

You will find the production release under `"$frontend/build/production/OctoZab"` (`$frontend` is the path where frontend is deployed).


## Roadmap

- ~~Allow to specify credentials for each Zabbix server~~
- ~~Add, remove, modify Zabbix servers configuration from frontend~~
- Replace treemap overview with some other way/chart that gives a better understanding of each Zabbix server healthy (give us your feedback on this)
- Many more Zabbix features based on audience feedback


## License

GPL v2