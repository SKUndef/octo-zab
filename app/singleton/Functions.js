/**
 * Singleton class with useful functions.
 */

Ext.define('OctoZab.singleton.Functions', {
	singleton: true,
	alternateClassName: ['Functions'],

	requires: [
		'Ext.window.Toast'
	],
	
	constructor: function(config) {
		this.initConfig(config);
	},

	toastShow: function(text, bgColor, textColor) {
		Ext.toast({
			html: 				text,
			closable: 			false,
			stickOnClick: 		false,
			align: 				't',
			slideInDuration: 	100,
			autoCloseDelay: 	2500,
			cls: 				'x-toast',
			bodyStyle: 			{ background: bgColor, color: textColor }
		});
	}
});