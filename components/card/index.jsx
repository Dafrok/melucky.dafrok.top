/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import './card.styl';

const {useState, useRef, useEffect} = React;

const signs = ['♠', '♥', '♣', '♦']
const numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export default function card({avatar, uname, uid, sign, number, selected, onClick}) {
    return <div className={`poker-card ${selected ? '' : 'unselected'}`} onClick={onClick}>
        <div className="forward">
            <div className={`sign ${sign === 1 || sign === 3 ? 'red' : 'black'}`}>{signs[sign]}{numbers[number]}</div>
            <div className="avatar">
                <div className="inner-image" style={{
                    backgroundImage: `url(${avatar})`
                }} ></div>
            </div>
            <div className="uname">{uname}</div>
        </div>
        <div className="backward">
            <div className="backward-background"></div>
        </div>
    </div>;
}
