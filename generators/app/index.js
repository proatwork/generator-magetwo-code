'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = Generator.extend({

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the rad ' + chalk.red('generator-magetwo-code') + ' generator!'
    ));

    var prompts = [
    	{
      	type: 'input',
      	name: 'namespace',
      	message: 'Namespace:',
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
      	choices : [
      		{
      			name	: "Block",
      			value : "block"
      		},
      		{
      			name	: "Setup",
      			value : "setup"
      		},
      		{
      			name	: "Frontend Views",
      			value : "frontendView"
      		},
      		{
      			name	: "Frontend Web (js+scss/css+require.js)",
      			value : "frontendViewWeb"
      		},
      		{
      			name	: "composer.json + README.md",
      			value : "composerReady"
      		}
      	]
    	}
    ];

    return this.prompt(prompts).then(function (props) {
      var components = props.components;
      this.namespace = _s.classify(props.namespace);
      this.module = _s.classify(props.module);
      
      function hasComponent(component){
      	return components && components.indexOf(component) !== -1;
      }
      
      this.hasBlock 					= hasComponent('block');
      this.hasSetup 					= hasComponent('setup');
      this.hasFrontendView		= hasComponent('frontendView');
      this.hasFrontendViewWeb = hasComponent('frontendViewWeb');
      this.hasComposer				= hasComponent('composerReady');
      
      this.phpNamespace = this.namespace + "\\" + this.module;
      
    }.bind(this));
  },

  writing : {
  	files : function(){
  		console.log('ye');
  	}
  },

  install: function () {
    this.installDependencies();
  }
});
