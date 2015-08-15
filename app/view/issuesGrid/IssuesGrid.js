/**
 * Last ISSUES GRID class
 */

Ext.define('OctoZab.view.issuesGrid.IssuesGrid', {
	extend: 'Ext.grid.Panel',

	xtype: 'grid-issues',
	controller: 'issuesGrid',

	store: 'Issues',

	title: 'ISSUES DETAILS',
	columnLines: false,
	rowLines: false,
	reserveScrollbar: true,
	sortableColumns: false,
	
	plugins: 'gridfilters',

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
				case "0": 	return 'not-classified-row';
				case "1": 	return 'info-row';
				case "2": 	return 'warning-row';
				case "3": 	return 'average-row';
				case "4": 	return 'high-row';
				case "5": 	return 'disaster-row';
				default	: 	return 'not-classified-row';
			}
		}
	},

	columns: {
		defaults: {
			sortable: false
		},
		items: [{
			text: 'LAST CHANGE',
			dataIndex: 'lastchange',
			align: 'center',
			width: 145,
			xtype: 'datecolumn',
			// format: 'd/m/y H:i:s',
			filter: true,
			renderer: function(value, metaData) {
				metaData.style 	= 'cursor: pointer;';
				metaData.tdAttr = 'title="Click for issue details"';

				return Ext.Date.format(value, "d/m/y H:i:s");
			}
		},{
			text: 'AGE',
			dataIndex: 'age',
			width: 100
		},{
			text: 'ZABBIX SERVER',
			dataIndex: 'server',
			align: 'center',
			flex: 1,
			filter: 'string',
			renderer: function(value, metaData) {
				metaData.style 	= 'cursor: pointer;';
				metaData.tdAttr = 'title="Click for Zabbix server overview"';

				return value;
			}
		},{
			text: 'HOSTNAME',
			dataIndex: 'hostname',
			flex: 2,
			filter: 'string',
			renderer: function(value, metaData) {
				metaData.style 	= 'cursor: pointer;';
				metaData.tdAttr = 'title="Click for latest host data"';

				return value;
			}
		},{
			text: 'TRIGGER',
			dataIndex: 'description',
			flex: 3,
			renderer: function(value, metaData) {
				metaData.style 	= 'cursor: pointer;';
				metaData.tdAttr = 'title="Click for issue details"';

				return value;
			}
		},{
			text: 'ACK',
			dataIndex: 'acknowledged',
			align: 'center',
			width: 65,
			xtype: 'booleancolumn',
			renderer: function(value, metaData) {
				return (value) ? 'Yes' : 'No';
			}
		},{
			text: 'SEVERITY',
			dataIndex: 'priority',
			align: 'center',
			width: 100,
			renderer: function(value, metaData, record) {
				switch (value) {
					case "0":
						metaData.tdCls = 'not-classified-cell';	return "Not classified";
					case "1":
						metaData.tdCls = 'info-cell'; 			return "Info";
					case "2":
						metaData.tdCls = 'warning-cell'; 		return "Warning";
					case "3":
						metaData.tdCls = 'average-cell'; 		return "Average";
					case "4":
						metaData.tdCls = 'high-cell'; 			return "High";
					case "5":
						metaData.tdCls = 'disaster-cell'; 		return "Disaster";
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
				]
			}
		}]
	}
});