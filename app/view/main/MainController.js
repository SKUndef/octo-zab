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
		}, 1000);
	},

	onLogoMove: function(view) {
		view.alignTo(this.getView().getEl(), 'bl', [19,-155]);
	},

	onIssuesMapRender: function(panel) {
		Cache.setIssuesMap(new Highcharts.Chart({
			chart: { 
				renderTo: panel.body.dom, backgroundColor: '#505459', spacing: [18, 60, 18, 60]
			},
			title: { text: null },
			credits: { enabled: false },
			noData: {
				style: { fontSize: '12px', color: '#FFF' }
			},
			// navigation: { buttonOptions: { symbolStroke: '#F3F3F3', // symbolY: 45, theme: { fill: "#7E878C", states: { hover:	{ stroke: '#40484C', fill: '#40484C' }, select:	{ stroke: '#40484C', fill: '#40484C' } } } } },
			legend: {
				layout: 'vertical', align: 'right', verticalAlign: 'bottom',
				itemMarginTop: 0, itemMarginBottom: 0, itemHoverStyle: null, // itemHiddenStyle: null,
				itemStyle: { color: "#FFF", fontWeight: 'bold' }
			},
			colorAxis: {
				dataClasses: [
					{ color: '#DDD', name: 'Not Classified'	, from: 0, to: 0},
					{ color: '#BFF', name: 'Information'	, from: 1, to: 1},
					{ color: '#FF8', name: 'Warning'		, from: 2, to: 2},
					{ color: '#FA6', name: 'Average'		, from: 3, to: 3},
					{ color: '#F77', name: 'High'			, from: 4, to: 4},
					{ color: '#F11', name: 'Disaster'		, from: 5, to: 5}
				]
			},
			xAxis: {
				events: {
					afterSetExtremes: function(e) {
						if ((e.min === 0) && (e.max === 100)) {
							var mainPanel = Ext.ComponentQuery.query('app-main')[0];

							Cache.getIssuesServerFilter().setValue("");
							Cache.getIssuesPriorityFilter().setValue(['0','1','2','3','4','5']);
							
							mainPanel.getViewModel().set('issuesMapView', 'ALL');
							mainPanel.down('grid-issues').filters.clearFilters();
							
							Ext.StoreMgr.lookup('Issues').reload();
						}
					}
				}
			},
			series: [{
				id: 'issues', type: "treemap", layoutAlgorithm: 'sliceAndDice',
				allowDrillToNode: true, levelIsConstant: false,
				borderColor: '#505459', cursor: 'pointer',
				dataLabels: { enabled: false },
				drillUpButton: {
					position: { align: 'right', x: 65, y: 5 },
					theme: { fill: "#E6E6E6", stroke: "#E6E6E6" }
				},
				levels: [{
					level: 1, borderWidth: 10,
					dataLabels: { enabled: true, style: { fontSize: '16px' } }
				},{
					level: 2, borderColor: 'transparent'
				}],
				events: {
					click: function(e) {
						var mainPanel = Ext.ComponentQuery.query('app-main')[0];

						if (!this.rootNode) {
							Cache.getIssuesServerFilter().setValue(e.point.id);
							Cache.getIssuesPriorityFilter().setValue(['0','1','2','3','4','5']);

							mainPanel.getViewModel().set('issuesMapView', e.point.name);
							mainPanel.down('grid-issues').filters.clearFilters();
							
							Ext.StoreMgr.lookup('Issues').reload();
						} else {
							Cache.getIssuesPriorityFilter().setValue([e.point.colorValue.toString()]);

							mainPanel.getViewModel().set('issuesMapView', e.point.parent.toUpperCase() + ' (' + e.point.name + ')');
							mainPanel.down('grid-issues').filters.clearFilters();
							
							Ext.StoreMgr.lookup('Issues').reload();
						}
					}
				}
			}]
		}));
	},

	onIssuesMapResize: function(panel, width, height) {
		Cache.getIssuesMap().setSize(width, height-36);
	}
});
