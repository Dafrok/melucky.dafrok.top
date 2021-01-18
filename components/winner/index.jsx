/**
 * @file winner
 * @author Dafrok
 */

import * as React from 'react';
import './winner.styl';

export default function winner({winner, reset}) {
    if (!winner) {
        return null;
    }
    return <div className="winner">
        <img className="avatar" src={winner.avatar} />
        <div className="name">{winner.uname}</div>
        <a className="again" onClick={reset}>再来一次</a>
    </div>
}
