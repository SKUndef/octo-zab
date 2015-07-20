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

	plugins: 'viewport',

	header: { cls: 'main-bar'},
	headerPosition: 'left',
	tabBar: { cls: 'main-bar'},
	tabBarHeaderPosition: 0,
	tabPosition: 'left',
	tabRotation: 0,

	tools: [{
		xtype: 'tbtext',
		itemId: 'logo-text',
		text: 'OCTO<span style="background-color: #BF0000; color: #FFF; padding: 0 5px">ZAB</span>',
		cls: 'logo-text'
	}],

	defaults: {
		tabConfig: { tooltipType: 'title' }
	},
	items: [{
		glyph: 'xf0e4@FontAwesome',
		margin: '15 10 15 0',
		tooltip: 'Dashboard',
			layout: { type: 'vbox', align: 'stretch' },
		items: [
			{ xtype: 'panel'		, margin: '0 10 10 0', flex: 2	, itemId: 'panel-issues-map'	, style: { borderRadius: '3px' }	},
			{ xtype: 'grid-issues'	, margin: '10 10 0 0', flex: 3	, itemId: 'panel-issues-list'	, style: { borderRadius: '3px' }	}
		]
	}]
});
