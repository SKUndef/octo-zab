/**
 * Singleton class to manage Socket.IO connection
 */

Ext.define('OctoZab.singleton.Socket', {
	singleton: true,
	alternateClassName: ['Socket'],

	constructor: function(config) {
		this.initConfig(config);
	},

	config: {
		socket: null
	},

	connect: function(view) {
		this.setSocket(io.connect(Cache.getBackendUrl()));

		this.getSocket().on('connect', function() {
			view.unmask();
		});

		this.getSocket().on('reconnect', function() {
			view.unmask();
		});

		this.getSocket().on('disconnect', function() {
			view.mask('UNREACHABLE BACKEND');
		});

		this.getSocket().on('servers.update', function(servers) {
			var store 			= Ext.StoreMgr.lookup('Servers'),
				serversData 	= [],
				serversToRemove = [],
				issuesStore		= Ext.StoreMgr.lookup('Issues'),
				issuesMapSeries	= Cache.getIssuesMap().get('issues');

			if (store.isLoaded()) {
				serversToRemove = _.difference(_.keys(Cache.getServers()), _.keys(servers));

				_.each(serversToRemove, function(server) {
					delete Cache.config.issues[server];
					delete Cache.config.issuesMapData[server];
				});

				Functions.toastShow('SERVERS CONFIGURATION UPDATED!', '#D94141', '#FFF');
			}

			Cache.setServers(servers);

			_.each(servers, function(v,k) {
				serversData.push({
					server	: k,
					user	: v.user,
					psw		: v.psw
				});
			});

			store.getProxy().setData(serversData);
			store.reload();

			if (_.isEmpty(servers)) {
				issuesStore.getProxy().setData([]);
				issuesStore.reload();
				
				issuesMapSeries.setData([]);
			}
		});

		this.getSocket().on('trigger.get.issues', function(data) {
			var store = Ext.StoreMgr.lookup('Issues'),
				issues = [];

			// console.log('[UPDATE] ' + data.server + ': issues');
			Cache.config.issues[data.server] = JSON.parse(data.val);

			_.each(Cache.getIssues(), function(v,k) {
				issues = issues.concat(v);
			});

			store.getProxy().setData(issues);
			store.reload();
		});

		this.getSocket().on('trigger.get.issues.map', function(data) {
			var issuesMapData = [];

			// console.log('[UPDATE] ' + data.server + ': issues.map');
			Cache.config.issuesMapData[data.server] = JSON.parse(data.val);

			_.each(Cache.getIssuesMapData(), function(v,k) {
				issuesMapData = issuesMapData.concat(v);
			});

			Cache.getIssuesMap().get('issues').setData(issuesMapData);
		});
	},

	updateServers: function(recs) {
		var servers = {};

		_.each(recs, function(rec) {
			servers[rec.data.server] = {
				server 	: rec.data.server,
				user 	: rec.data.user,
				psw 	: rec.data.psw
			};
		});

		this.getSocket().emit('servers.set', servers);
	}
});