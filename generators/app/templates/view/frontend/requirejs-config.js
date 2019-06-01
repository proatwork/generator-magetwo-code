var config = {
    map: {
        '*': {
            '<%= context.vendor_lc %>_<%= context.module_lc %>'  : '<%= context.class_name %>/js/<%= context.module_lc %>'
        }
    },
    shim: {
        '<%= context.vendor_lc %>_<%= context.module_lc %>'  : {
            deps : ['jquery']
        }
    }
};