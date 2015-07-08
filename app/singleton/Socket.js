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
			view.mask('Server unreachable...', 'no-data-mask');
		});

		this.getSocket().on('get.servers', function(servers) {
			Cache.setServers(servers);
		});

		this.getSocket().on('trigger.get.issues', function(data) {
			var store = Ext.StoreMgr.lookup('Issues'),
				issues = [];

			// console.log('[UPDATE] ' + data.server + ': issues');
			Cache.config.issues[data.server] = JSON.parse(data.val);

			Object.keys(Cache.getIssues()).forEach(function(server) {
				issues = issues.concat(Cache.getIssues()[server]);
			});

			store.getProxy().setData(issues);
			store.reload();
		});

		this.getSocket().on('trigger.get.issues.map', function(data) {
			var issuesMapData = [];

			// console.log('[UPDATE] ' + data.server + ': issues.map');
			Cache.config.issuesMapData[data.server] = JSON.parse(data.val);

			Object.keys(Cache.getIssuesMapData()).forEach(function(server) {
				issuesMapData = issuesMapData.concat(Cache.getIssuesMapData()[server]);
			});

			Cache.getIssuesMap().get('issues').setData(issuesMapData);
		});
	}
});