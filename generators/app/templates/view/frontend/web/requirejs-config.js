var config = {
    paths: {
        '<%= context.vendor_lc %>_<%= context.module_lc %>' : '<%= context.class_name %>/js/<%= context.module_lc %>.js'
    },
    shim : {
        '<%= context.vendor_lc %>_<%= context.module_lc %>' : {
            deps : ['jquery']
        }
    }
}