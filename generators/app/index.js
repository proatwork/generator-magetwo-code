'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = Generator.extend({
    errors : {
        NO_COMPONENTS : "No components selected... Failing...",
        NO_FRONTEND_SELECTED : "You forgot to add frontend views! Continuing anyway...",
        NO_FRONTEND_WEB_SELECTED : "You forgot to add frontend web! Continuing anyway..."
    },
    prompting: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the rad ' + chalk.red('generator-magetwo-code') + ' generator!'
        ));
        var done = this.async();
        this.author = {
            name: this.user.git.name(),
            email: this.user.git.email()
        };

        var prompts = [
            {
                type: 'input',
                name: 'vendor',
                message: 'Vendor:',
                default: "NWT"
            },
            {
                type: 'input',
                name: 'module',
                message: 'Module Name:',
                default: "Custom"
            },
            {
                type: 'checkbox',
                name: 'components',
                message: 'Components:',
                choices: [
                    {
                        name: "Block",
                        value: "block"
                    },
                    {
                        name: "Setup",
                        value: "setup"
                    },
                    {
                        name: "Frontend Views",
                        value: "frontendView"
                    },
                    {
                        name: "Frontend Web (js+scss/css+require.js)",
                        value: "frontendViewWeb"
                    },
                    {
                        name: "composer.json + README.md",
                        value: "composerReady"
                    }
                ]
            }
        ];

        return this.prompt(prompts).then(function (props) {
            var components = props.components;
            this.components = props.components;

            this.vendor = _s.classify(props.vendor);
            this.module = _s.classify(props.module);

            function hasComponent(component) {
                return components && components.indexOf(component) !== -1;
            }
            /* CONFIG */
            this.hasBlock = hasComponent('block');
            this.hasSetup = hasComponent('setup');
            this.hasFrontendView = hasComponent('frontendView');
            this.hasFrontendViewWeb = hasComponent('frontendViewWeb');
            this.hasComposer = hasComponent('composerReady');
            this.phpNamespace = this.vendor + "\\" + this.module; /*        NWT_Custom */
            this.modulePath = this.vendor + "/" + this.module + "/"; /*     NWT/Custom/ <-- trailing slash  */
            this.moduleClassName = this.vendor + "_" + this.module;
            done();

        }.bind(this));
    },

    writing: {
        structure : function(){
            var dis = this;
            var path = this.modulePath;

            if(!this.components.length){
                this.log.error(this.errors.NO_COMPONENTS);
                process.exit(1);
                return;
            }
            function buildTpl(filename, parameters){
                dis.fs.copyTpl(
                    dis.templatePath(filename),
                    dis.destinationPath(path + filename),
                    parameters
                );
            }
            mkdirp(path);
            mkdirp(path + "etc/");
                buildTpl('registration.php',{
                    className : this.moduleClassName
                });
            this.hasBlock ? mkdirp(path + "Block/") : '';
            this.hasSetup ? mkdirp(path + "Setup/") : '';
            if(this.hasFrontendView){
                var folders = ['layout','templates'];
                folders.forEach(function(folder) {
                    mkdirp(path + "view/frontend/" + folder);
                });
            };
            if(this.hasFrontendViewWeb){
                if(!this.hasFrontendView) console.log(chalk.yellow(this.errors.NO_FRONTEND_SELECTED));
                var folders = ['web'];
                folders.forEach(function(folder) {
                    mkdirp(path + "view/frontend/" + folder);
                });
            }
            if(this.hasComposer){
                if(!this.hasFrontendView) console.log(chalk.yellow(this.errors.NO_FRONTEND_SELECTED));
                if(!this.hasFrontendViewWeb) console.log(chalk.yellow(this.errors.NO_FRONTEND_WEB_SELECTED));
            }
        },
        registration : function(){

        },
        files: function () {

        }
    },

    install: function () {
        this.installDependencies();
    }
});
