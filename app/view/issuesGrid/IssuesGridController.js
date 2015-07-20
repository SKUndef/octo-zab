/**
 * Last ISSUES GRID viewcontroller class
 */
Ext.define('OctoZab.view.main.IssuesGridController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.issuesGrid',

	control: {
		'#': {
			rowclick: 'onIssueClick'
		}
	},

	onIssueClick: function(gridTable, rec) {
		var server 		= rec.data.server,
			triggerid	= rec.data.triggerid,
			eventid		= rec.data.eventid;

		window.open('//' + server + '/zabbix/tr_events.php?triggerid=' + triggerid + '&eventid=' + eventid, '_blank');
	}
});