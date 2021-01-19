/**
 * @file loading
 * @author Dafrok
 */

import * as React from 'react';
import './loading.styl';

export default function loading({size}) {
    return <div class="lds-ring" style={{
        width: size,
        height: size
    }}><div /><div /><div /><div /></div>;
}
