var config = {
    paths: {
        '<%= js_path %>' : '<%= moduleClassName %>/js/<%= lcModule %>.js'
    },
    shim : {
        '<%= js_path %>' : {
            deps : ['jquery']
        }
    }
}