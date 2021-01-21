/**
 * @file root component
 * @author Dafrok
 */
import './killer.styl';
import * as React from 'react';

export default function killer({children, onClick, show}) {
    let color = '';
    switch (children) {
        case '♠':
        case '♣': {
            color = 'black';
            break;
        }
        case '♥':
        case '♦': {
            color = 'red';
            break;
        }
        case '1/2': {
            color = 'blue';
            break;
        }
    }
    return <div onClick={onClick} className={`killer ${color} ${show ? '' : 'disabled'}`}>
        {children}
    </div>
}