/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('OctoZab.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	control: {
		'#': {
			afterrender: 'onAfterRender'
		},
		"#logo-text": {
			move: 'onLogoMove'
		},
		"#panel-issues-map": {
			boxready:	'onIssuesMapRender',
			resize:		'onIssuesMapResize'
		}
	},

	onAfterRender: function(view) {
		setTimeout(function() {
			if (Socket.getSocket() === null) {
				view.mask('Server unreachable...', 'no-data-mask');
			}
		}, 350);
	},

	onLogoMove: function(view) {
		view.alignTo(this.getView().getEl(), 'bl', [28,-155]);
	},

	onIssuesMapRender: function(panel) {
		Cache.setIssuesMap(new Highcharts.Chart({
			chart: { 
				renderTo: panel.body.dom, backgroundColor: '#717E85'
			},
			title: {
				text: 'Issues Map', align: 'left', x: 10,
				style: { color: '#FFFFFF', fontSize: '24px', fontVariant: 'small-caps' }
			},
			subtitle: {
				text: 'Overview: ALL', align: 'left', x: 10,
				style: { color: '#E6E6E6', fontSize: '14px' }
			},
			credits: { enabled: false },
			navigation: {
				buttonOptions: {
					symbolStroke: '#F3F3F3', // symbolY: 45,
					theme: {
						fill: "#717E85",
						states: {
							hover:	{ stroke: '#40484C', fill: '#40484C' },
							select:	{ stroke: '#40484C', fill: '#40484C' }
						}
					}
				}
			},
			legend: {
				layout: 'vertical', align: 'right', verticalAlign: 'bottom',
				itemMarginTop: 1, itemMarginBottom: 1, itemHoverStyle: null, // itemHiddenStyle: null,
				itemStyle: { color: "#F3F3F3", fontWeight: 'normal' }
			},
			colorAxis: {
				dataClasses: [
					{ color: '#DDD', name: 'Not Classified'	, from: 0, to: 0},
					{ color: '#DFF', name: 'Information'	, from: 1, to: 1},
					{ color: '#FFA', name: 'Warning'		, from: 2, to: 2},
					{ color: '#FB8', name: 'Average'		, from: 3, to: 3},
					{ color: '#F99', name: 'High'			, from: 4, to: 4},
					{ color: '#F33', name: 'Disaster'		, from: 5, to: 5}
				]
			},
			xAxis: {
				events: {
					afterSetExtremes: function(e) {
						if ((e.min === 0) && (e.max === 100)) {
							Cache.getIssuesServerFilter().setValue("");
							Cache.getIssuesPriorityFilter().setValue(['0','1','2','3','4','5']);
							Ext.ComponentQuery.query('grid-issues')[0].filters.clearFilters();
							Ext.StoreMgr.lookup('Issues').reload();
							Cache.getIssuesMap().setTitle(null, { text: 'Overview: ALL'});
						}
					}
				}
			},
			series: [{
				id: 'issues', type: "treemap", layoutAlgorithm: 'strip',
				allowDrillToNode: true, levelIsConstant: false,
				borderColor: '#717E85', cursor: 'pointer',
				dataLabels: { enabled: false },
				drillUpButton: {
					position: { align: 'right', x: 65, y: -55 }
				},
				levels: [{
					level: 1, borderWidth: 10,
					dataLabels: { enabled: true, style: { fontSize: '14px'} }
				},{
					level: 2, borderColor: 'transparent'
				}],
				events: {
					click: function(e) {
						if (!this.rootNode) {
							Cache.getIssuesServerFilter().setValue(e.point.id);
							Cache.getIssuesPriorityFilter().setValue(['0','1','2','3','4','5']);
							Ext.ComponentQuery.query('grid-issues')[0].filters.clearFilters();
							Ext.StoreMgr.lookup('Issues').reload();
							Cache.getIssuesMap().setTitle(null, { text: 'Overview: ' + e.point.name});
						} else {
							Cache.getIssuesPriorityFilter().setValue([e.point.colorValue.toString()]);
							Ext.ComponentQuery.query('grid-issues')[0].filters.clearFilters();
							Ext.StoreMgr.lookup('Issues').reload();
							Cache.getIssuesMap().setTitle(null, { text: 'Overview: ' + e.point.parent.toUpperCase() + ' (' + e.point.name + ')'});
						}
					}
				}
			}]
		}));
	},

	onIssuesMapResize: function(panel, width, height) {
		Cache.getIssuesMap().setSize(width, height);
	}
});
