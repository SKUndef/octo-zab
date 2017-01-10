/**
 * Last ISSUES GRID viewcontroller class
 */
Ext.define('OctoZab.view.main.ServersGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.serversGrid',

    onAddServer: function() {
        var grid = this.getView(),
            store = grid.getStore();

        grid.getPlugin('rowEdit').startEdit(store.add({
            server: '',
            user: '',
            psw: ''
        })[0]);
    },

    onServerBeforeEdit: function() {
        this.lookupReference('addBtn').disable();
    },

    onServerEdit: function() {
        this.lookupReference('addBtn').enable();
    },

    onServerEditCanc: function(editor, context) {
        if (!context.value) {
            this.getView().getStore().remove(context.record);
        }

        this.onServerEdit();
    },

    onDeleteServer: function(btn) {
        this.getView().getStore().remove(btn.getWidgetRecord());
    },

    onResetServers: function() {
        var store = this.getView().getStore();

        store.rejectChanges();
        store.reload();
    },

    onSaveServers: function() {
        var store = this.getView().getStore(),
            recs = store.getRange(),
            modRecs = store.getModifiedRecords(),
            delRecs = store.getRemovedRecords();

        if (modRecs.length || delRecs.length) {
            Ext.Msg.show({
                title: 'SAVE',
                message: 'Do you want to update servers configuration?',
                closable: false,
                buttons: Ext.Msg.OKCANCEL,
                fn: function(btn) {
                    if (btn == 'ok') {
                        Socket.updateServers(recs);
                    }
                }
            });
        } else {
            Ext.Msg.show({
                title: 'ERROR!',
                message: 'No modification to the actual servers configuration',
                closable: false,
                buttons: Ext.Msg.OK
            });
        }

        // Ext.Msg.show({
        //     title: 'RESET',
        //     message: 'Being this a demo, configuration change is disabled. Resetting...',
        //     closable: false,
        //     buttons: Ext.Msg.OK
        // });
		//
        // this.onResetServers();
    }
});
