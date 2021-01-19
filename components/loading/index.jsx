/**
 * @file loading
 * @author Dafrok
 */

import * as React from 'react';
import './loading.styl';

export default function loading({size}) {
    return <span className="lds-ring" style={{
        width: size,
        height: size
    }}><span /><span /><span /><span /></span>;
}
