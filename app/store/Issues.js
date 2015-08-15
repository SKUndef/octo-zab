/**
 * Last ISSUES GRID store class.
 */

Ext.define('OctoZab.store.Issues', {
	extend: 'Ext.data.Store',

	model: 'OctoZab.model.Issues',
	
	// autoLoad: true,
	// autoSync: true,
	batchUpdateMode: 'complete',

	groupField: 'server',

	sorters: [{
		property: 'acknowledged'
	},{
		property: 'priority',
		direction: 'DESC'
	},{
		property: 'lastchange',
		direction: 'DESC'
	}],
	
	filters: [
		Cache.getIssuesServerFilter(),
		Cache.getIssuesPriorityFilter()
	]
});