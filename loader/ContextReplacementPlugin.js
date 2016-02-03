/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');
var fileSystem = require('fs');

function ContextReplacementPlugin(resourceRegExp, newContentResource, newContentRecursive, newContentRegExp) {  
	this.resourceRegExp = resourceRegExp;
	if(typeof newContentResource === "function") {
		this.newContentCallback = newContentResource;
	} else if(typeof newContentResource === "string" && typeof newContentRecursive === "object") {
		this.newContentResource = newContentResource;
		this.newContentCreateContextMap = function(fs, callback) {
			callback(null, newContentRecursive)
		};
	} else if(typeof newContentResource === "string" && typeof newContentRecursive === "function") {
		this.newContentResource = newContentResource;
		this.newContentCreateContextMap = newContentRecursive;
	} else {
		if(typeof newContentResource !== "string") {
			newContentRegExp = newContentRecursive;
			newContentRecursive = newContentResource;
			newContentResource = undefined;
		}
		if(typeof newContentRecursive !== "boolean") {
			newContentRegExp = newContentRecursive;
			newContentRecursive = undefined;
		}
		this.newContentResource = newContentResource;
		this.newContentRecursive = newContentRecursive;
		this.newContentRegExp = newContentRegExp;
	}
}
module.exports = ContextReplacementPlugin;
ContextReplacementPlugin.prototype.apply = function(compiler) {
	var resourceRegExp = this.resourceRegExp;
	var newContentCallback = this.newContentCallback;
	var newContentResource = this.newContentResource;
	var newContentRecursive = this.newContentRecursive;
	var newContentRegExp = this.newContentRegExp;
	var newContentCreateContextMap = this.newContentCreateContextMap;
	compiler.plugin("context-module-factory", function(cmf) {
		cmf.plugin("before-resolve", function(result, callback) {
			if(!result) return callback();
			if(resourceRegExp.test(result.request)) {
				if(typeof newContentResource !== "undefined")
					result.request = newContentResource;
				if(typeof newContentRecursive !== "undefined")
					result.recursive = newContentRecursive;
				if(typeof newContentRegExp !== "undefined")
					result.regExp = newContentRegExp;
				if(typeof newContentCallback === "function") {
					newContentCallback(result);
				}
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
          // Also include all other modules as subdependencies when it is an aurelia module.
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