var _		= require('underscore'),
	request	= require('request'),
	io		= require('socket.io')(8080),
	Redis	= require('ioredis'),
	sub		= new Redis(6379, '127.0.0.1'),
	pub		= new Redis(6379, '127.0.0.1');

pub.smembers('octo-zab:servers:name.set', function(err,servers) {
	log('info', 'servers', servers);

	for (var i = 0; i < servers.length; i++) {
		var defaultReq = request.defaults({
			method: 'POST',
			url: 'http://'+ servers[i] + '/zabbix/api_jsonrpc.php',
			timeout: 10000,
			json: true
		});

		serverAuth(defaultReq, servers[i], i);
	}

	io.on('connection', function(socket) {
		log('info', 'connect', socket.id + ' (' + Object.keys(io.sockets.connected).length + ' total)');

		socket.emit('get.servers', servers);

		servers.forEach(function(server) {
			socket.join(server);

			pub.keys('octo-zab:' + server + ':monitored:*', function(err,keys) {
				if (err === null) {
					keys.forEach(function(key) {
						pub.get(key, function(err,val) {
							if (err === null) {
								socket.emit(key.split(':')[3], { server: server, val: val });
							} else { log('err', 'get', key); }
						});
					});
				} else { log('err', 'keys', 'octo-zab:' + server + ':monitored:*'); }
			});
		});

		socket.on('disconnect', function() {
			log('info', 'disconnect', socket.id + ' (' + Object.keys(io.sockets.connected).length + ' total)');
		});
	});
});

function serverAuth(req, server, serverIdx) {
	req({
		body: {
			method: 'user.login',
			params: { user: 'Admin', password: 'zabbix' },
			jsonrpc: '2.0', id: 1
		}
	}, 
		function(err,resp,body) {
			if (err === null) {
				var auth = body.result;

				getIssues(req, auth, server, serverIdx);
			} else {
				log('err', 'request', server + ': user.login');

				setTimeout(function() { serverAuth(req, server, serverIdx); }, 10000);
			}
		}
	);
}

function getIssues(req, auth, server, serverIdx) {
	req({
		body: {
			method: 'trigger.get',
			params: {
				output: [ 'description', 'comments', 'lastchange', 'priority' ],
				monitored: true,
				maintenance: false,
				min_severity: 2,
				expandData: 'true',
				selectLastEvent: [ 'eventid', 'acknowledged' ],
				filter: { value: 1 }
			},
			jsonrpc: '2.0', id: 1, auth: auth
		}
	}, 
		function(err,resp,body) {
			if ((err === null) && (body.result !== undefined)) {
				var severityMapping = {
						0: 'Not Classified',
						1: 'Information',
						2: 'Warning',
						3: 'Average',
						4: 'High',
						5: 'Disaster'
					},
					severityCount = [0, 0, 0, 0, 0, 0],
					mapData = [];

				body.result.forEach(function(issue) {
					issue.server = server;
					severityCount[issue.priority] += 1;
				});

				mapData.push({
					id: server,
					name: server.toUpperCase(),
					colorValue: severityCount.indexOf(_.last(_.compact(severityCount)))
				});

				for (var i = 0; i < severityCount.length; i++) {
					mapData.push({
						id: server + '_' + i,
						name: severityMapping[i],
						parent: server,
						value: severityCount[i],
						colorValue: i
					});
				}

				pub.mset(
					'octo-zab:' + server + ':monitored:trigger.get.issues'		, JSON.stringify(body.result),
					'octo-zab:' + server + ':monitored:trigger.get.issues.map'	, JSON.stringify(mapData),
				function(err) {
					if (err !== null) {
						log('err', 'mset', 'octo-zab:' + server + ':monitored:trigger.get.issues*');
					}
				});
			} else { log('err', 'request', server + ': trigger.get'); }
		}
	);

	setTimeout(function() { getIssues(req, auth, server, serverIdx); }, 180000);
}

sub.psubscribe('__keyspace@0__:octo-zab:*');
sub.on('pmessage', function(patt,chan,event) {
	var key		= chan.replace('__keyspace@0__:', ''),
		server	= chan.split(':')[2],
		branch	= chan.split(':')[3],
		obj		= chan.split(':')[4];

	// log('info', event, chan.replace('__keyspace@0__:octo-zab:', ''));

	switch (branch) {
		case "monitored":
			pub.get(key, function(err,val) {
				io.to(server).emit(obj, { server: server, val: val });
			});
			break;
	}
});

/* LOG function */
function log(type, op, msg) {

	var color = '\u001b[0m',
		reset = '\u001b[0m';

	switch(type) {
		case "info":
			color = '\u001b[36m';
			break;
		case "warn":
			color = '\u001b[33m';
			break;
		case "err":
			color = '\u001b[31m';
			break;
		case "msg":
			color = '\u001b[34m';
			break;
		default:
			color = '\u001b[0m';
			break;
	}

	var now = new Date();
	var now_string = now.getDate() + "/" + (now.getMonth()+1) + "\t" + now.toLocaleTimeString();
	console.log('\u001b[1m' + color + now_string + '\t' + type + '\t- ' + reset + '[' + op.toUpperCase() + '] ' + msg);
}