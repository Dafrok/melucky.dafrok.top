/**
 * @file winner
 * @author Dafrok
 */

import * as React from 'react';
import './winner.styl';
import {signs, numbers} from '../../lib/config';

export default function winner({winner, reset, clean}) {
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
        <div className="controls">
            <a className="control" onClick={reset}>重新开始</a>
            <a className="control" onClick={clean}>结束抽奖</a>
        </div>
    </div>;
}
