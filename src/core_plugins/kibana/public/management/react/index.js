/* eslint-disable */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import createHistory from 'history/lib/createHashHistory';
import { rootReducer } from './reducers';
import { initData } from './app/app.actions';
import globals from './globals';

import App from './app/index';
import IndexPatternRedirect from './index-pattern';
import {
  IndexPatternCreate,
  IndexPatternList
 } from './index-pattern';

 import {
   fetchIndexPatterns,
 } from './store/actions/index-pattern-list';

const initialState = {};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = composeEnhancers(applyMiddleware(thunk))(createStore)(rootReducer, initialState);

const renderPage = (page, targetId) => {
  render(
    <Provider store={store}>
      <App>
        {page}
      </App>
    </Provider>,
    document.getElementById(targetId)
  );
};

const ReactApp = {
  init: ($injector, managementConfig) => {
    ReactApp.setGlobals($injector);
    const kbnVersion = $injector.get('kbnVersion');
    store.dispatch(initData(kbnVersion, managementConfig));
  },

  getStore: () => store,

  setGlobals: $injector => {
    globals.es = $injector.get('es');
    globals.indexPatterns = $injector.get('indexPatterns');
    globals.config = $injector.get('config');
    globals.kbnUrl = $injector.get('kbnUrl');
    globals.$http = $injector.get('$http');
  },

  renderIndexPatternCreate: targetId => renderPage(<IndexPatternCreate/>, targetId),
  renderIndexPatternList: targetId => {
    store.dispatch(fetchIndexPatterns());
    renderPage(<IndexPatternList/>, targetId);
  },
};

export default ReactApp;
