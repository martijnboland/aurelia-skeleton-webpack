import {Origin} from 'aurelia-metadata';
import {TemplateRegistryEntry, Loader} from 'aurelia-loader';
import {DOM, PLATFORM} from 'aurelia-pal';

/**
* An implementation of the TemplateLoader interface implemented with text-based loading.
*/
export class TextTemplateLoader {
  /**
  * Loads a template.
  * @param loader The loader that is requesting the template load.
  * @param entry The TemplateRegistryEntry to load and populate with a template.
  * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
  */
  loadTemplate(loader, entry) {
    return loader.loadText(entry.address).then(text => {
      entry.template = DOM.createTemplateFromMarkup(text);
    });
  }
}


function ensureOriginOnExports(executed, name) {
  let target = executed;
  let key;
  let exportedValue;

  if (target.__useDefault) {
    target = target['default'];
  }

  Origin.set(target, new Origin(name, 'default'));

  for (key in target) {
    exportedValue = target[key];

    if (typeof exportedValue === 'function') {
      Origin.set(exportedValue, new Origin(name, key));
    }
  }

  return executed;
}

/**
* A default implementation of the Loader abstraction which works with webpack (extended common-js style).
*/
export class WebpackLoader extends Loader {

  constructor() {
    super();

    this.moduleRegistry = {};
    this.loaderPlugins = {}; 
    this._initModuleRegistry();
    this.useTemplateLoader(new TextTemplateLoader());

    let that = this;

    this.addPlugin('template-registry-entry', {
      'fetch': function(address) {
        let entry = that.getOrCreateTemplateRegistryEntry(address);
        return entry.templateIsLoaded ? entry : that.templateLoader.loadTemplate(that, entry).then(x => entry);
      }
    });
  }

  _initModuleRegistry() {    
    this._registerModule('aurelia-event-aggregator', require('aurelia-event-aggregator'));
    this._registerModule('aurelia-fetch-client', require('aurelia-fetch-client'));
    this._registerModule('aurelia-framework', require('aurelia-framework'));
    this._registerModule('aurelia-history-browser', require('aurelia-history-browser'));
    this._registerModule('aurelia-logging-console', require('aurelia-logging-console'));
    this._registerModule('aurelia-templating-binding', require('aurelia-templating-binding'));
    
    const aureliaTemplatingResources = require('aurelia-templating-resources');
    this._registerModule('aurelia-templating-resources', aureliaTemplatingResources);
    this._registerModule('aurelia-templating-resources/compose', { Compose: aureliaTemplatingResources.Compose });
    this._registerModule('aurelia-templating-resources/if', { If: aureliaTemplatingResources.If });
    this._registerModule('aurelia-templating-resources/with', { With: aureliaTemplatingResources.With });
    this._registerModule('aurelia-templating-resources/repeat', { Repeat: aureliaTemplatingResources.Repeat });
    this._registerModule('aurelia-templating-resources/show', { Show: aureliaTemplatingResources.Show });
    this._registerModule('aurelia-templating-resources/replaceable', { Replaceable: aureliaTemplatingResources.Replaceable });
    this._registerModule('aurelia-templating-resources/sanitize-html', { SanitizeHTMLValueConverter: aureliaTemplatingResources.SanitizeHTMLValueConverter });
    this._registerModule('aurelia-templating-resources/focus', { Focus: aureliaTemplatingResources.Focus });
    this._registerModule('aurelia-templating-resources/compile-spy', { CompileSpy: aureliaTemplatingResources.CompileSpy });
    this._registerModule('aurelia-templating-resources/view-spy', { ViewSpy: aureliaTemplatingResources.ViewSpy });
    this._registerModule('aurelia-templating-resources/binding-mode-behaviors', {
      OneTimeBindingBehavior: aureliaTemplatingResources.OneTimeBindingBehavior, 
      OneWayBindingBehavior: aureliaTemplatingResources.OneWayBindingBehavior, 
      TwoWayBindingBehavior: aureliaTemplatingResources.TwoWayBindingBehavior 
    });
    this._registerModule('aurelia-templating-resources/throttle-binding-behavior', { ThrottleBindingBehavior: aureliaTemplatingResources.ThrottleBindingBehavior });
    this._registerModule('aurelia-templating-resources/debounce-binding-behavior', { DebounceBindingBehavior: aureliaTemplatingResources.DebounceBindingBehavior });
    this._registerModule('aurelia-templating-resources/signal-binding-behavior', { SignalBindingBehavior: aureliaTemplatingResources.SignalBindingBehavior });
    this._registerModule('aurelia-templating-resources/update-trigger-binding-behavior', { UpdateTriggerBindingBehavior: aureliaTemplatingResources.UpdateTriggerBindingBehavior });

    const aureliaTemplatingRouter = require('aurelia-templating-router');
    this._registerModule('aurelia-templating-router', aureliaTemplatingRouter);    
    this._registerModule('aurelia-templating-router/route-href', { RouteHref:  aureliaTemplatingRouter.RouteHref });
    this._registerModule('aurelia-templating-router/router-view', { RouterView:  aureliaTemplatingRouter.RouterView });
  }
  
  _registerModule(name, module) {
    this.moduleRegistry[name] = ensureOriginOnExports(module, name);
  }

  _import(moduleId) {
    
    const moduleIdParts = moduleId.split('!');
    const path = moduleIdParts.splice(moduleIdParts.length - 1, 1)[0];
    const loaderPlugin = moduleIdParts.length == 1 ? moduleIdParts[0] : null;
         
    return new Promise((resolve, reject) => {
      try {
        let m = null;
        
        if (loaderPlugin) {
          m = this.loaderPlugins[loaderPlugin].fetch(path);
        }
        else {
          m = require(`${__APP_SRC__}/${path}`);        
        }
        resolve(m);
      } catch (e) {
        reject(e);
      }
    });
  }
  
  /**
  * Maps a module id to a source.
  * @param id The module id.
  * @param source The source to map the module to.
  */
  map(id, source) {

  }

  /**
  * Normalizes a module id.
  * @param moduleId The module id to normalize.
  * @param relativeTo What the module id should be normalized relative to.
  * @return The normalized module id.
  */
  normalizeSync(moduleId, relativeTo) {
    return moduleId;
  }

  /**
  * Normalizes a module id.
  * @param moduleId The module id to normalize.
  * @param relativeTo What the module id should be normalized relative to.
  * @return The normalized module id.
  */  
  normalize(moduleId, relativeTo) {
    return Promise.resolve(moduleId);
  }

  /**
  * Instructs the loader to use a specific TemplateLoader instance for loading templates
  * @param templateLoader The instance of TemplateLoader to use for loading templates.
  */
  useTemplateLoader(templateLoader) {
    this.templateLoader = templateLoader;
  }

  /**
  * Loads a collection of modules.
  * @param ids The set of module ids to load.
  * @return A Promise for an array of loaded modules.
  */
  loadAllModules(ids) {
    let loads = [];

    for (let i = 0, ii = ids.length; i < ii; ++i) {
      loads.push(this.loadModule(ids[i]));
    }

    return Promise.all(loads);
  }
  
  /**
  * Loads a module.
  * @param id The module id to normalize.
  * @return A Promise for the loaded module.
  */
  loadModule(id) {
    let existing = this.moduleRegistry[id];
    if (existing) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve, reject) => {
      try {  
        this._import(id).then(m => {
          this.moduleRegistry[id] = m;
          resolve(ensureOriginOnExports(m, id));                
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  /**
  * Loads a template.
  * @param url The url of the template to load.
  * @return A Promise for a TemplateRegistryEntry containing the template.
  */
  loadTemplate(url) {
    return this._import(this.applyPluginToUrl(url, 'template-registry-entry'));
  }

  /**
  * Loads a text-based resource.
  * @param url The url of the text file to load.
  * @return A Promise for text content.
  */
  loadText(url) {
    return this._import(url);
  }
  
  /**
  * Alters a module id so that it includes a plugin loader.
  * @param url The url of the module to load.
  * @param pluginName The plugin to apply to the module id.
  * @return The plugin-based module id.
  */
  applyPluginToUrl(url, pluginName) {
    return `${pluginName}!${url}`;
  };

  /**
  * Registers a plugin with the loader.
  * @param pluginName The name of the plugin.
  * @param implementation The plugin implementation.
  */
  addPlugin(pluginName, implementation) {
    this.loaderPlugins[pluginName] = implementation;
  };
}

PLATFORM.Loader = WebpackLoader;

PLATFORM.eachModule = function(callback) {};