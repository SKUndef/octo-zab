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
	},
		'server',
		'hostname',
		'description',
		'comments',
		'priority',
	{
		name: 'acknowledged',
		mapping: 'lastEvent.acknowledged',
		type: 'boolean'
	}],

	proxy: { type: 'memory' }
});