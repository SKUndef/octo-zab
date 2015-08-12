/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */
Ext.define('OctoZab.view.main.Main', {
	extend: 'Ext.tab.Panel',

	requires: [
		'Ext.grid.filters.Filters',
		'Ext.grid.column.Date'
	],

	xtype: 'app-main',
	controller: 'main',
	viewModel: { type: 'main' },

	plugins: 'viewport',

	header: { cls: 'main-bar' },
	tabBar: { cls: 'main-bar' },
	
	headerPosition: 'left',
	tabBarHeaderPosition: 0,
	tabPosition: 'left',
	tabRotation: 0,

	tools: [{
		xtype: 'tbtext',
		itemId: 'logo-text',
		text: '<span style="color: #FFF">OCTO<span style="background-color: #BF0000; color: #FFF; padding: 0 5px">ZAB</span></span>',
		cls: 'logo-text'
	}],

	defaults: {
		bodyPadding: 	'20 50 20 50',
		tabConfig: 		{ tooltipType: 	'title' }
	},
	items: [{
		glyph: 'xf0e4@FontAwesome',
		tooltip: 'Dashboard',
		
		layout: { type: 'vbox', align: 'stretch' },
		
		items: [{
			xtype: 	'tbtext',
			text: 	"DASHBOARD",
			height: 26,
			margin: '0 0 20 0',
			cls: 	'tab-panel-title'
		},{
			xtype: 	'panel',
			itemId: 'panel-issues-map',
			margin: '0 0 10 0',
			flex: 	3,
			bind: {
				title: 	'ISSUES MAP - Overview: {issuesMapView}'
			}
		},{
			xtype: 	'grid-issues',
			itemId: 'panel-issues-list',
			margin: '10 0 0 0',
			flex: 	4
		}]
	},{
		glyph: 'xf013@FontAwesome',
		tooltip: 'Settings',
		
		layout: { type: 'vbox', align: 'stretch' },
		
		items: [{
			xtype: 	'tbtext',
			text: 	"SETTINGS",
			height: 26,
			margin: '0 0 20 0',
			cls: 	'tab-panel-title'
		}]
	}]
});
