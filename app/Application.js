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
		'OctoZab.singleton.Cache'
	],

	views: [
		'main.Main',
		'issuesGrid.IssuesGrid'
	],

	stores: [
		'Issues'
	],
	
	launch: function () {
		Cache.connectServer(Ext.createByAlias('widget.app-main'));
	}
});