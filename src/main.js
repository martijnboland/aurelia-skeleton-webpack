import * as aureliaBootstrapper from 'aurelia-bootstrapper';
import '../loader/aurelia-loader-webpack';

require('bootstrap/css/bootstrap.css');
require('../node_modules/font-awesome/css/font-awesome.css');
require('../styles/styles.css');


export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(() => aurelia.setRoot());
}