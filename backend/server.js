/**
 * OCTOZAB NODEJS backend server
 */

var _		= require('underscore'),
	request	= require('request'),
	io		= require('socket.io')(8080),
	Redis	= require('ioredis'),
	sub		= new Redis(6379, '127.0.0.1'),
	pub		= new Redis(6379, '127.0.0.1');

var servers 			= {},
	authPendingTasks 	= {},
	getIssuesTasks 		= {};


/* LOG function */
function log(type, op, msg) {
	var color = '\u001b[0m',
		reset = '\u001b[0m';

	switch(type) {
		case "info"		: color = '\u001b[36m'	; break;
		case "warn"		: color = '\u001b[33m'	; break;
		case "err"		: color = '\u001b[31m'	; break;
		case "msg"		: color = '\u001b[34m'	; break;
		default 		: color = '\u001b[0m'	; break;
	}

	var now 		= new Date(),
		now_string 	= now.getDate() + "/" + (now.getMonth()+1) + "\t" + now.toLocaleTimeString();

	console.log('\u001b[1m' + color + now_string + '\t' + type + '\t- ' + reset + '[' + op.toUpperCase() + '] ' + msg);
}

function connectToServer(server) {
	servers[server] = {};

	pub.hgetall('octo-zab:'+ server + ':settings:credentials', function(err,creds) {
		servers[server].user 	= creds.user;
		servers[server].psw 	= creds.psw;

		var defaultReq = request.defaults({
			method: 	'POST',
			url: 		'http://'+ server + '/zabbix/api_jsonrpc.php',
			timeout: 	10000,
			json: 		true
		});

		serverAuth(defaultReq, server, creds.user, creds.psw);
	});
}

function serverAuth(req, server, user, psw) {
	req({
		body: {
			method: 'user.login',
			params: { user: user, password: psw },
			jsonrpc: '2.0', id: 1
		}
	}, 
		function(err,resp,body) {

			if (err === null) {
				getServerIssues(req, body.result, server);

				delete authPendingTasks[server];
			} else {
				log('err', 'request', server + ': user.login');

				authPendingTasks[server] = setTimeout(function() { serverAuth(req, server); }, 10000);
			}
		}
	);
}

function getServerIssues(req, token, server) {
	req({
		body: {
			method: 'trigger.get', jsonrpc: '2.0', id: 1, auth: token,
			params: {
				output: 			[ 'description', 'comments', 'lastchange', 'priority' ],
				monitored: 			true,
				maintenance: 		false,
				min_severity: 		2,
				expandData: 		'true',
				selectLastEvent: 	[ 'eventid', 'acknowledged' ],
				filter: 			{ value: 1 }
			}
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
					severityCount 	= {},
					mapData 		= [];

				body.result.forEach(function(issue) {
					issue.server 					= server;
					severityCount[issue.priority] 	= (severityCount[issue.priority]) ? severityCount[issue.priority] + 1 : 1;
				});

				mapData.push({
					id: 		server,
					name: 		server.toUpperCase(),
					colorValue: _.max(_.keys(severityCount))
				});

				_.each(severityCount, function(v,k) {
					mapData.push({
						id: 		server + '_' + k,
						name: 		severityMapping[k],
						parent: 	server,
						value: 		v,
						colorValue: k
					});
				});

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

	getIssuesTasks[server] = setTimeout(function() { getServerIssues(req, token, server); }, 10000);
}


/** APPLICATION INITIALIZATION */

pub.keys('octo-zab:*:settings:credentials', function(err,keys) {
	if (err === null) {
		_.each(keys, function(key) {
			var server = key.split(':')[1];

			connectToServer(server);
		});

		log('info', 'servers', _.keys(servers));
	} else {
		log('err', 'hgetall', 'octo-zab:*:settings:credentials');
	}
});


io.on('connection', function(socket) {
	log('info', 'connect', socket.id + ' (' + Object.keys(io.sockets.connected).length + ' total)');

	socket.emit('servers.update', servers);

	pub.keys('octo-zab:*:monitored:*', function(err,keys) {
		if (err === null) {
			_.each(keys, function(key) {
				pub.get(key, function(err,val) {
					if (err === null) {
						var server 	= key.split(':')[1],
							obj 	= key.split(':')[3];

						socket.emit(obj, { server: server, val: val });
					} else {
						log('err', 'get', key);
					}
				});
			});
		} else {
			log('err', 'keys', 'octo-zab:*:monitored:*');
		}
	});

	socket.on('servers.set', function(serversConf) {
		_.each(authPendingTasks, 	function(v,k) { clearTimeout(v); });
		_.each(getIssuesTasks, 		function(v,k) { clearTimeout(v); });

		servers 			= {};
		authPendingTasks 	= {};
		getIssuesTasks		= {};

		pub.flushall();

		_.each(serversConf, function(serverData, server) {
			var user 	= serverData.user,
				psw 	= serverData.psw;

			pub.hmset('octo-zab:'+ server + ':settings:credentials',
				{ user: user, psw: psw },
			function(err) {
				if (err === null) {
					connectToServer(server);
				} else {
					log('err', 'hmset', 'octo-zab:' + server + ':settings:credentials');
				}
			});
		});

		io.emit('servers.update', serversConf);

		log('warn', 'servers', 'CONFIG CHANGE: ' + _.keys(serversConf));
	});

	socket.on('disconnect', function() {
		log('info', 'disconnect', socket.id + ' (' + Object.keys(io.sockets.connected).length + ' total)');
	});
});


sub.psubscribe('__keyspace@0__:octo-zab:*');

sub.on('pmessage', function(patt,chan,event) {
	var key		= chan.replace('__keyspace@0__:', ''),
		server	= key.split(':')[1],
		branch	= key.split(':')[2],
		obj		= key.split(':')[3];

	// log('info', event, chan.replace('__keyspace@0__:octo-zab:', ''));

	switch (branch) {
		case "monitored":
			pub.get(key, function(err,val) {
				io.emit(obj, { server: server, val: val });
			});
			break;
	}
});