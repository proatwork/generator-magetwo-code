'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var _s = require('underscore.string');

module.exports = Generator.extend({
	vars : {
        MSG_NO_COMPONENTS : "No components selected... Failing...",
        MSG_NO_FRONTEND_SELECTED : "You forgot to add frontend views! Continuing anyway..."
    },
    _die : function(data){
        var done = this.async();
		console.log(data);
		done();
		process.exit(1);
    },
    prompting: function () {
        var done = this.async();
        var $t = this;
        this.context = {},
        this.context.git_remote = shell.exec("git config --get remote.origin.url", {silent : true}).stdout.replace(/(\r\n|\n|\r)/gm,"") || false;
        this.context.git_branch = shell.exec("git rev-parse --abbrev-ref HEAD", {silent : true}).stdout.replace(/(\r\n|\n|\r)/gm,"") || "<your_branch>";
        this.context.author = this.user.git.name() || "Yeoman";

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
                        value: "block",
                        checked : true
                    },
                    {
                        name: "Install and Upgrade Schema",
                        value: "setup",
                        checked : true
                    },
                    {
                        name: "Frontend (XML + PHTML + JS + SCSS + require.js)",
                        value: "frontend",
                        checked : true
                    },
                    {
                        name: "composer.json + README.md",
                        value: "composer_readme",
                        checked : true
                    }
                ]
            },
            {
                type: 'input',
                name: 'author',
                message: 'Author:',
                default: this.context.author
            },
			{
				type: 'input',
				name: 'description',
				message: 'Module Short Description:',
				default: "Generated with Yeoman by " + this.context.author
			},
            {
                type: 'input',
                name: 'remote',
                message: 'Git remote:',
                default: this.context.git_remote || ""
            }
        ];
        

        return this.prompt(prompts).then(function (props) {
			var components = props.components;
			function hasComponent(component) {
				return components && components.indexOf(component) !== -1;
			}
        	
            this.COMPONENT_BLOCK = hasComponent('block');
            this.COMPONENT_SETUP = hasComponent('setup');
            this.COMPONENT_FRONTEND = hasComponent('frontend');
            this.COMPONENT_COMPOSER_README = hasComponent('composer_readme');
            
        	this.context.author = props.author;
            this.context.components = props.components;
            this.context.description = props.description;
            this.context.vendor = _s.classify(props.vendor);
            this.context.module = _s.classify(props.module);
            this.context.vendor_lc = props.vendor.toLowerCase();
			this.context.module_lc = props.module.toLowerCase();
            this.context.git_remote = props.remote || this.context.git_remote;
        	this.context.namespace = this.context.vendor + "\\" + this.context.module; //=> Your\Module
        	this.context.base_path = this.context.vendor + "/" + this.context.module + "/"; //=> Your/Module
        	this.context.class_name = this.context.vendor + "_" + this.context.module; //=> Your_Module
        	this.context.header_file_name = "fileHeader.txt";
			this.context.default_block = "MyBlock";
			this.context.default_block_lc = this.context.default_block.toLowerCase();
            done();
        }.bind(this));
    },
    writing: {
        structure : function(){
            var _this = this; // this' context change, man ..
            var PATH = this.context.base_path;
            
            // FILE STRUCTURE
            var module_xml_files =	['di.xml','module.xml'];
        	var schema_files =		["InstallSchema.php","UpgradeSchema.php"];
        	var frontend_files_regular = [
				'layout/default.xml',
				'layout/default_head_blocks.xml',
				'templates/_scripts.phtml',
				'web/requirejs-config.js'
    		];
    		var frontend_files_special = [
    			['templates/custom.phtml','templates/' + this.context.default_block_lc + '.phtml'], //=> myblock.phtml
    			['web/css/custom.scss','web/css/' + this.context.module_lc + '.scss'], //=> module.scss
    			['web/js/custom.source.js','web/js/' + this.context.module_lc + '.source.js'], //=> module.source.js
    		];
            
            // If no components are selected there's no point in continuing,,,
            if(!this.context.components.length){
                console.log(chalk.red(this.vars.MSG_NO_COMPONENTS));
                process.exit(1);
                return;
            }
            
            // Generate a temporary header file which we can include.
            this.fs.copyTpl(
                this.templatePath(this.context.header_file_name),
                this.destinationPath(this.context.header_file_name),
                {
                	class_name	: this.context.class_name,
                	author		: this.context.author,
                	description : this.context.description
                }
            );
            this.context.header_file = this.fs.read(this.destinationPath(this.context.header_file_name));

            // Generate registration.php
            this.fs.copyTpl(
                this.templatePath('registration.php'),
                this.destinationPath(PATH +'registration.php'),
                {context : this.context}
            );
            
            // Generate the helper
            this.fs.copyTpl(
                this.templatePath('Helper/Data.php'),
                this.destinationPath(PATH +'Helper/Data.php'),
                {context : this.context}
            );
            
            // Generate the XMLs inside /etc
            module_xml_files.forEach(function(xml){
	            _this.fs.copyTpl(
	                _this.templatePath('etc/' + xml),
	                _this.destinationPath(PATH +'etc/' + xml),
	                {context : _this.context}
	            );
            });
            
            // Generate a sample Block
            if(this.COMPONENT_BLOCK){
                _this.fs.copyTpl(
                    _this.templatePath("Block/Block.php"),
                    _this.destinationPath(PATH + "Block/"+ _this.context.default_block +".php"),
                    {context: this.context}
                );
            }

			// Generate Install and Upgrade Schema...
            if(this.COMPONENT_SETUP){
	            schema_files.forEach(function(schema_file){
		            _this.fs.copyTpl(
		                _this.templatePath('Setup/' + schema_file),
		                _this.destinationPath(PATH +'Setup/' + schema_file),
		                {context : _this.context}
		            );
	            });
            }

			// Generate layout, templates web/css and web/js files
            if(this.COMPONENT_FRONTEND){
            	var FRONTEND_PATH = "view/frontend/";
            	frontend_files_regular.forEach(function(regular){
		            _this.fs.copyTpl(
		                _this.templatePath(FRONTEND_PATH + regular),
		                _this.destinationPath(PATH + FRONTEND_PATH + regular),
		                {context : _this.context}
		            );
            	});
            	frontend_files_special.forEach(function(special){
		            _this.fs.copyTpl(
		                _this.templatePath(FRONTEND_PATH + special[0]),
		                _this.destinationPath(PATH + FRONTEND_PATH + special[1]),
		                {context : _this.context}
		            );
            	});
            }
			/** composer.json + README.md **/
            if(this.COMPONENT_COMPOSER_README){
                if(!this.COMPONENT_FRONTEND) console.log(chalk.yellow(this.vars.MSG_NO_FRONTEND_SELECTED));
	            this.fs.copyTpl(
	                this.templatePath('composer.json'),
	                this.destinationPath('composer.json'),
	                {context : this.context}
	            );
	            if(this.context.git_remote){
		            this.fs.copyTpl(
		                this.templatePath('README.md'),
		                this.destinationPath('README.md'),
		                {context : this.context}
		            );
	            }
            }
            /** delete fileHeader **/
            this.fs.delete(this.destinationPath('fileHeader.txt'));
        }
    },
    install: function () {
        this.installDependencies();
    }
});
