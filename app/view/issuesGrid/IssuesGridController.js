/**
 * Last ISSUES GRID viewcontroller class
 */
Ext.define('OctoZab.view.main.IssuesGridController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.issuesGrid',

	control: {
		'#': {
			cellclick: 'onIssueClick'
		}
	},

	onIssueClick: function(table, td, index, rec) {
		var server 		= rec.data.server,
			hostid 		= rec.data.hostid,
			triggerid	= rec.data.triggerid,
			eventid		= rec.data.eventid;

		switch (index) {
			case 0:
			case 4:
				window.open('//' + server + '/zabbix/tr_events.php?triggerid=' + triggerid + '&eventid=' + eventid, '_blank'); break;
			case 2:
				window.open('//' + server + '/zabbix/dashboard.php', '_blank'); break;
			case 3:
				window.open('//' + server + '/zabbix/latest.php?hostids%5B%5D=' + hostid + '&show_without_data=1&filter_set=Filter', '_blank'); break;
		}
	}
});