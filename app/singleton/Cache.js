/**
 * Singleton class to retain values retrieved from backend.
 */

Ext.define('OctoZab.singleton.Cache', {
	singleton: true,
	alternateClassName: ['Cache'],
	
	constructor: function(config) {
		this.initConfig(config);
	},

	config: {
		backendUrl:				config.backendUrl + ':' + config.backendPort,
		nodeTask:				null,
		servers:				null,
		issues:					{},
		issuesServerFilter:		new Ext.util.Filter({
									id: 'server-filter',
									property: 'server',
									value: ""
								}),
		issuesPriorityFilter:	new Ext.util.Filter({
									id: 'priority-filter',
									property: 'priority',
									operator: 'in',
									value: ['0','1','2','3','4','5']
								}),
		issuesMapData:			{},
		issuesMap:				null
	},

	connectServer: function(view) {
		this.setNodeTask(Ext.TaskManager.start({
			interval: 10*1000,

			run: function() {
				if (Socket.getSocket() === null) {
					$.getScript('//' + Cache.getBackendUrl() + '/socket.io/socket.io.js')
						.done(function() {
							Socket.connect(view);
							Ext.TaskManager.stop(Cache.getNodeTask());
					});
				}
			}
		}));
	}
});