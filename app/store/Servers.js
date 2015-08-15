/**
 * ZABBIX SERVERS store class.
 */

Ext.define('OctoZab.store.Servers', {
	extend: 'Ext.data.Store',

	fields: [
		'server',
		'user',
		'psw'
	],
	
	batchUpdateMode: 'complete'
});