/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('OctoZab.Application', {
	
	extend: 'Ext.app.Application',
	
	name: 'OctoZab',

	requires: [
		'OctoZab.singleton.Socket',
		'OctoZab.singleton.Cache',
		'OctoZab.singleton.Functions'
	],

	views: [
		'main.Main',
		'issuesGrid.IssuesGrid',
		'serversGrid.ServersGrid'
	],

	stores: [
		'Issues',
		'Servers'
	],
	
	launch: function () {
		Highcharts.setOptions({
			global	: { useUTC: false },
			chart	: { style: { fontFamily: "helvetica,arial,verdana,sans-serif" } }
		});

		Cache.connectServer(Ext.createByAlias('widget.app-main'));
	}
});