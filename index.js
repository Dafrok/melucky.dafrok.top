/**
 * @file entry
 * @author Dafrok
 */
import 'regenerator-runtime/runtime';
import * as React from 'react';
import {render} from 'react-dom';
import App from './components/index';
import './resources/bulma.min.css';

const $app = document.createElement('div');
document.body.appendChild($app);
render(<App />, $app);
