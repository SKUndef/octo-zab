/**
 * ZABBIX SERVERS GRID class
 */

Ext.define('OctoZab.view.serversGrid.ServersGrid', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-servers',
    controller: 'serversGrid',

    store: 'Servers',

    title: 'SERVERS',
    columnLines: false,
    rowLines: false,
    reserveScrollbar: true,
    sortableColumns: false,
    bufferedRenderer: false,

    bodyStyle: {
        backgroundColor: "#676B73"
    },

    tools: [{
        xtype: 'button',
        reference: 'addBtn',
        glyph: 'xf067@FontAwesome',
        tooltip: 'Add server',
        tooltipType: 'title',
        cls: 'dark-tool-button',
        handler: 'onAddServer'
    }],

    plugins: [{
        ptype: 'rowediting',
        pluginId: 'rowEdit',
        autoCancel: false,
        errorSummary: false,
        listeners: {
            beforeedit: 'onServerBeforeEdit',
            edit: 'onServerEdit',
            canceledit: 'onServerEditCanc',
            scope: 'controller'
        }
    }],

    viewConfig: {
        getRowClass: function(record) {
            return 'dark-big-row';
        }
    },

    columns: {
        defaults: {
            align: 'center'
        },
        items: [{
            text: 'HOST',
            dataIndex: 'server',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            renderer: function(value, metaData) {
                metaData.style = "font-weight: bold";
                return value;
            },
            flex: 1
        }, {
            text: 'USER',
            dataIndex: 'user',
            sortable: false,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            flex: 1
        }, {
            text: 'PASSWORD',
            dataIndex: 'psw',
            sortable: false,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            renderer: function(value, metaData) {
                return Array(value.length + 1).join("\u2022");
            },
            flex: 1
        }, {
            xtype: 'widgetcolumn',
            sortable: false,
            menuDisabled: true,
            width: 52,
            widget: {
                xtype: 'button',
                glyph: 'xf014@FontAwesome',
                tooltip: 'Delete server',
                tooltipType: 'title',
                cls: 'dark-grid-icon',
                handler: 'onDeleteServer'
            }
        }]
    },

    buttons: [{
        text: 'Reset',
        tooltip: 'Reset configuration',
        tooltipType: 'title',
        handler: 'onResetServers'
    }, {
        text: 'Save',
        tooltip: 'Save configuration',
        tooltipType: 'title',
        handler: 'onSaveServers'
    }]
});
