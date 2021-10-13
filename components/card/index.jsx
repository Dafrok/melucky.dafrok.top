/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import './card.styl';
import {signs, numbers} from '../../lib/config';

export default function card({avatar, uname, uid, sign, number, selected, dead, winner, onClick}) {
    return <div className={`poker-card ${dead ? 'dead' : 'unselected'} ${winner ? 'win' : ''}`} onClick={onClick}>
        <div className="forward">
            <div className={`sign ${sign === 1 || sign === 3 ? 'red' : 'black'}`}>{signs[sign]}{numbers[number]}</div>
            <div className="avatar">
                <img className="inner-image" src={avatar} />
            </div>
            <div className="uname">{uname}</div>
        </div>
        <div className="backward">
            <div className="backward-background"></div>
        </div>
    </div>;
}
