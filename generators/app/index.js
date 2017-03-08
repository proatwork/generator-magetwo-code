'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var _s = require('underscore.string');

module.exports = Generator.extend({
    errors : {
        NO_COMPONENTS : "No components selected... Failing...",
        NO_FRONTEND_SELECTED : "You forgot to add frontend views! Continuing anyway...",
        NO_FRONTEND_WEB_SELECTED : "You forgot to add frontend web! Continuing anyway..."
    },
    prompting: function () {

        var done = this.async();
        // Have Yeoman greet the user.
        this.author = this.user.git.name() || "Yeoman";
        this.git_remote = shell.exec("git config --get remote.origin.url", {silent : true}).stdout.replace(/(\r\n|\n|\r)/gm,"") || false;

        this.log(yosay(
            'Welcome to the rad ' + chalk.red('generator-magetwo-code') + ' generator!'
        ));
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
            },
			{
				type: 'input',
				name: 'description',
				message: 'Module Short Description:',
				default: "Generated with Yeoman" + (this.author.name ? "by : " + this.author.name : "")
			},
            {
                type: 'input',
                name: 'author',
                message: 'Author:',
                default: this.author
            }
        ];

        return this.prompt(prompts).then(function (props) {
            var components = props.components;
            this.components = props.components;
            this.description = props.description;

            this.vendor = _s.classify(props.vendor);
            this.module = _s.classify(props.module);
            this.remote = props.remote;

			this.git_branch = shell.exec("git rev-parse --abbrev-ref HEAD", {silent : true}).stdout.replace(/(\r\n|\n|\r)/gm,"") || false;

            function hasComponent(component) {
                return components && components.indexOf(component) !== -1;
            }
            /* CONFIG */
            this.hasBlock = hasComponent('block');
            this.hasSetup = hasComponent('setup');
            this.hasFrontendView = hasComponent('frontendView');
            this.hasFrontendViewWeb = hasComponent('frontendViewWeb');
            this.hasComposer = hasComponent('composerReady');
            this.phpNamespace = this.vendor + "\\" + this.module; /*        NWT\Custom */
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
                console.log(chalk.red(this.errors.NO_COMPONENTS));
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
			function getFileHeader(){
				return dis.fs.read(dis.destinationPath(path + 'fileHeader.txt'));
			}
            mkdirp(path);

			/** fileHeader.php **/
            buildTpl("fileHeader.txt",{
                author : this.author,
                packageName : this.moduleClassName,
                description : this.description
            });

            /** registration.php **/
            mkdirp(path + "etc/");
                buildTpl('registration.php',{
                    header : getFileHeader(),
                    className : this.moduleClassName
                });

            /** make block **/
            if(this.hasBlock){
                mkdirp(path + "Block");
                var blockClass = "Custom";
                dis.fs.copyTpl(
                    dis.templatePath("Block/Block.php"),
                    dis.destinationPath(path + "Block/"+blockClass+".php"),
                    {
                        header : getFileHeader(),
                        blockClass : blockClass,
                        namespace : this.phpNamespace
                    }
                );
            }

            /** make setup **/
            if(this.hasSetup){
                mkdirp(path + "Setup");
                var files = ["InstallSchema.php","UpgradeSchema.php"];
                var dis = this;
                files.forEach(function(filename){
                    buildTpl('Setup/' + filename,{
                        header : getFileHeader(),
                        namespace : dis.phpNamespace
                    });
                });
            }

            /** make frontend/layout and frontend/templates **/
            if(this.hasFrontendView){
                var dis = this;
                var folders = ['layout','templates'];
                folders.forEach(function(folder) {
                    mkdirp(path + "view/frontend/" + folder);
                });

                var layoutFiles = ['default.xml','default_head_blocks.xml'];
                layoutFiles.forEach(function(layoutFile){
                    buildTpl("view/frontend/" + folders[0] + '/' + layoutFile,{
                        header : getFileHeader(),
                        lcModule : dis.module.toLowerCase()
                    });
                });

            };

            /** make web folder **/
            if(this.hasFrontendViewWeb){
                if(!this.hasFrontendView) console.log(chalk.yellow(this.errors.NO_FRONTEND_SELECTED));
                var folders = ['web'];
                folders.forEach(function(folder) {
                    mkdirp(path + "view/frontend/" + folder);
                });
            }
			/** composer.json + README.md **/
            if(this.hasComposer){
                if(!this.hasFrontendView) console.log(chalk.yellow(this.errors.NO_FRONTEND_SELECTED));
                if(!this.hasFrontendViewWeb) console.log(chalk.yellow(this.errors.NO_FRONTEND_WEB_SELECTED));
				buildTpl('composer.json',{
					vendor : this.vendor,
					module : this.module,
					lcVendor : this.vendor.toLowerCase(),
					lcModule : this.module.toLowerCase(),
					description : this.description
				}); 
				if(this.remote){
					buildTpl('README.md',{
					    gitBranch : this.git_branch,
						gitRemote : this.remote,
						modulePath : this.modulePath,
						lcVendor : this.vendor.toLowerCase(),
						lcModule : this.module.toLowerCase()
					});
                }
            }

            /** delete fileHeader **/
            this.fs.delete(dis.destinationPath(path + 'fileHeader.txt'));
        }
    },

    install: function () {
        this.installDependencies();
    }
});
