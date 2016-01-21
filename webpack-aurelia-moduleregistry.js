export default function getModules() {

  let modules = {};

  modules['aurelia-animator-css'] = require('aurelia-animator-css');   
  modules['aurelia-event-aggregator'] = require('aurelia-event-aggregator');
  modules['aurelia-fetch-client'] = require('aurelia-fetch-client');
  modules['aurelia-framework'] = require('aurelia-framework');
  modules['aurelia-history-browser'] = require('aurelia-history-browser');
  modules['aurelia-logging-console'] = require('aurelia-logging-console');
  modules['aurelia-templating-binding'] = require('aurelia-templating-binding');

  const aureliaTemplatingResources = require('aurelia-templating-resources');

  modules['aurelia-templating-resources'] = aureliaTemplatingResources;
  modules['aurelia-templating-resources/compose'] = { Compose: aureliaTemplatingResources.Compose };
  modules['aurelia-templating-resources/if'] = { If: aureliaTemplatingResources.If };
  modules['aurelia-templating-resources/with'] = { With: aureliaTemplatingResources.With };
  modules['aurelia-templating-resources/repeat'] = { Repeat: aureliaTemplatingResources.Repeat };
  modules['aurelia-templating-resources/show'] = { Show: aureliaTemplatingResources.Show };
  modules['aurelia-templating-resources/replaceable'] = { Replaceable: aureliaTemplatingResources.Replaceable };
  modules['aurelia-templating-resources/sanitize-html'] = { SanitizeHTMLValueConverter: aureliaTemplatingResources.SanitizeHTMLValueConverter };
  modules['aurelia-templating-resources/focus'] = { Focus: aureliaTemplatingResources.Focus };
  modules['aurelia-templating-resources/compile-spy'] = { CompileSpy: aureliaTemplatingResources.CompileSpy };
  modules['aurelia-templating-resources/view-spy'] = { ViewSpy: aureliaTemplatingResources.ViewSpy };
  modules['aurelia-templating-resources/binding-mode-behaviors'] = {
    OneTimeBindingBehavior: aureliaTemplatingResources.OneTimeBindingBehavior, 
    OneWayBindingBehavior: aureliaTemplatingResources.OneWayBindingBehavior, 
    TwoWayBindingBehavior: aureliaTemplatingResources.TwoWayBindingBehavior 
  };
  modules['aurelia-templating-resources/throttle-binding-behavior'] = { ThrottleBindingBehavior: aureliaTemplatingResources.ThrottleBindingBehavior };
  modules['aurelia-templating-resources/debounce-binding-behavior'] = { DebounceBindingBehavior: aureliaTemplatingResources.DebounceBindingBehavior };
  modules['aurelia-templating-resources/signal-binding-behavior'] = { SignalBindingBehavior: aureliaTemplatingResources.SignalBindingBehavior };
  modules['aurelia-templating-resources/update-trigger-binding-behavior'] = { UpdateTriggerBindingBehavior: aureliaTemplatingResources.UpdateTriggerBindingBehavior };

  const aureliaTemplatingRouter = require('aurelia-templating-router');
  modules['aurelia-templating-router'] = aureliaTemplatingRouter;    
  modules['aurelia-templating-router/route-href'] = { RouteHref:  aureliaTemplatingRouter.RouteHref };
  modules['aurelia-templating-router/router-view'] = { RouterView:  aureliaTemplatingRouter.RouterView };

  return modules;
}