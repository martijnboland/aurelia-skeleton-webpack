/*
	MIT License http://www.opensource.org/licenses/mit-license.php
  Based on ContextReplacementPlugin by Tobias Koppers @sokra
*/
var path = require("path");
var fileSystem = require('fs');
var ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');

function AureliaContextPlugin(resourceRegExp, newContentResource, createContextMap) {  
	this.resourceRegExp = resourceRegExp;
  this.newContentResource = newContentResource;
  this.newContentCreateContextMap = createContextMap;
}

module.exports = AureliaContextPlugin;

AureliaContextPlugin.prototype.apply = function(compiler) {
	var resourceRegExp = this.resourceRegExp;
	var newContentResource = this.newContentResource;
	var newContentCreateContextMap = this.newContentCreateContextMap;
	compiler.plugin("context-module-factory", function(cmf) {
		cmf.plugin("before-resolve", function(result, callback) {
			if(!result) return callback();
			if(resourceRegExp.test(result.request)) {
				if(typeof newContentResource !== "undefined")
					result.request = newContentResource;
			}
			return callback(null, result);
		});
		cmf.plugin("after-resolve", function(result, callback) {
			if(!result) return callback();
			if(newContentResource.endsWith(result.resource)) {
				if(typeof newContentCreateContextMap === "function")
					result.resolveDependencies = createResolveDependenciesFromContextMap(newContentCreateContextMap, result.resolveDependencies);
			}
			return callback(null, result);
		});
	});
};

function createResolveDependenciesFromContextMap(createContextMap, originalResolveDependencies) {
	return function resolveDependenciesFromContextMap(fs, resource, recursive, regExp, callback) {
    
    originalResolveDependencies(fs, resource, recursive, regExp, function (err, dependencies)  {
      if(err) return callback(err);
      
      createContextMap(fs, function(err, map) {
        if(err) return callback(err);
        
        Object.keys(map).forEach(function(key) {
          // Add main module as dependency
          dependencies.push(new ContextElementDependency(key, './' + key));
          // Also include all other modules as subdependencies when it is an aurelia module. This is required
          // because Aurelia submodules are not in the root of the NPM package and thus cannot be loaded 
          // directly like import 'aurelia-templating-resources/compose'
          if (key.startsWith('aurelia-')) {
            var mainDir = path.dirname(map[key]);
            var mainFileName = path.basename(map[key]);
            var files = fileSystem.readdirSync(mainDir);
            files.forEach(function(fileName) {
              if (fileName.indexOf(mainFileName) === -1 && fileName.match(/[^\.]\.(js|jsx|html|css|less|sass)$/)) {
                var subModuleKey = key + '/' + path.basename(fileName, path.extname(fileName));
                dependencies.push(new ContextElementDependency(path.resolve(mainDir, fileName), './' + subModuleKey));
              } 
            });          
          }
        });
        
        callback(null, dependencies);
      });      
    });
    
	}
};