/**
 * @file winner
 * @author Dafrok
 */

import * as React from 'react';
import './winner.styl';
import {signs, numbers} from '../../lib/config';

export default function winner({winner, reset}) {
    if (!winner) {
        return null;
    }
    const {sign, number, avatar, uname} = winner;
    return <div className="winner">
        <div className={`poker ${sign === 1 || sign === 3 ? 'red' : 'black'}`}>
            {signs[sign]}{numbers[number]}
        </div>
        <img className="avatar" src={avatar} />
        <div className="name">{uname}</div>
        <a className="again" onClick={reset}>再来一次</a>
    </div>
}
