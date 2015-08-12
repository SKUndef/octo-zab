/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('OctoZab.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        appName:        'OctoZab',
        issuesMapView:  'ALL'
    }
});