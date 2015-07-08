/**
 * Last ISSUES GRID class
 */

Ext.define('OctoZab.view.issuesGrid.IssuesGrid', {
	extend: 'Ext.grid.Panel',

	xtype: 'grid-issues',
	store: 'Issues',
	plugins: 'gridfilters',

	// title: 'Issues List',
	columnLines: false,
	rowLines: false,
	reserveScrollbar: true,
	
	features: [{
		ftype: 'grouping',
		disabled: true,
		groupHeaderTpl: '{name} ({children.length} issues)'
	}],

	viewConfig: {
		getRowClass: function(record) {
			if (record.data.acknowledged === true) {
				return 'acknowledged-row';
			}

			switch (record.data.priority) {
				case "0":
					return 'not-classified-row';
				case "1":
					return 'info-row';
				case "2":
					return 'warning-row';
				case "3":
					return 'average-row';
				case "4":
					return 'high-row';
				case "5":
					return 'disaster-row';
				default:
					return 'not-classified-row';
			}
		}
	},

	columns: [{
		text: 'Last Change',
		dataIndex: 'lastchange',
		align: 'center',
		width: 145,
		xtype: 'datecolumn',
		format: 'd/m/y H:i:s',
		filter: true
	},{
		text: 'Zabbix Server',
		dataIndex: 'server',
		align: 'center',
		flex: 1,
		filter: 'string'
	},{
		text: 'Hostname',
		dataIndex: 'hostname',
		flex: 2,
		filter: 'string'
	},{
		text: 'Trigger',
		dataIndex: 'description',
		flex: 3
	},{
		text: 'Description',
		dataIndex: 'comments',
		flex: 3
	},{
		text: 'Ack',
		dataIndex: 'acknowledged',
		align: 'center',
		width: 65,
		xtype: 'booleancolumn',
		renderer: function(value, metaData) {
			return (value === true) ? 'Yes' : 'No';
		}
	},{
		text: 'Severity',
		dataIndex: 'priority',
		align: 'center',
		width: 90,
		renderer: function(value, metaData, record) {
			switch (value) {
				case "0":
					metaData.tdCls = 'not-classified-cell';
					return "Not classified";
				case "1":
					metaData.tdCls = 'info-cell';
					return "Info";
				case "2":
					metaData.tdCls = 'warning-cell';
					return "Warning";
				case "3":
					metaData.tdCls = 'average-cell';
					return "Average";
				case "4":
					metaData.tdCls = 'high-cell';
					return "High";
				case "5":
					metaData.tdCls = 'disaster-cell';
					return "Disaster";
				default:
					return value;
			}
		},
		filter: {
			type: 'list',
			options: [
				[ '0', "Not classified" ],
				[ '1', "Info" ],
				[ '2', "Warning" ],
				[ '3', "Average" ],
				[ '4', "High" ],
				[ '5', "Disaster" ]
			],
			// value: ['3', '4', '5']
		}
	}]
});