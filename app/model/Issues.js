/**
 * Last ISSUES GRID elements MODEL class.
 * It displays TRIGGER.GET api output, filtered to display issues only.
 */

Ext.define('OctoZab.model.Issues', {
	extend: 'OctoZab.model.Base',

	fields: [{
		name: 'lastchange',
		type: 'date', 
		convert: function(value) {
			if (value instanceof Date === false) {
				return new Date(parseInt(value, 10)*1000);
			} else {
				return value;
			}
		}
	},{
		name: 'age',
		calculate: function(data) {
			var lastChange = new Date(data.lastchange),
				now = new Date(),
				days, hours, mins;

			days = Ext.Date.diff(
				lastChange,
				now,
				Ext.Date.DAY
			);
			hours = Ext.Date.diff(
				lastChange,
				Ext.Date.subtract(now, Ext.Date.DAY, days),
				Ext.Date.HOUR
			);
			mins = Ext.Date.diff(
				lastChange,
				Ext.Date.subtract(
					Ext.Date.subtract(now, Ext.Date.DAY, days),
					Ext.Date.HOUR,
					hours
				),
				Ext.Date.MINUTE
			);

			return days + 'd ' + hours + 'h ' + mins + 'm';
		}
	},
		'server',
		'hostid',
		'hostname',
		'description',
		'comments',
		'priority',
		'triggerid',
	{
		name: 'eventid',
		mapping: 'lastEvent.eventid'
	},{
		name: 'acknowledged',
		mapping: 'lastEvent.acknowledged',
		type: 'boolean'
	}],

	proxy: { type: 'memory' }
});