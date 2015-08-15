/**
 * BASE MODEL on which other models extend their functionality.
 */

Ext.define('OctoZab.model.Base', {
	extend: 'Ext.data.Model',

	fields: [{
		name: 'id',
		type: 'int'
	}],

	schema: {
		namespace: 'OctoZab.model'
	}
});