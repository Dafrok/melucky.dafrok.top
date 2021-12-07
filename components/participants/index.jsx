/**
 * @file Card
 * @author Dafrok
 */

import * as React from 'react';
import './style.styl';
import avatar from '../../resources/card.png';
 
export default function participants({participants, addParticipant, deleteParticipant, addMember}) {
    const pList = Object.values(participants);
    const [uname, setUname] = React.useState('');

    function selectParticipant(participant) {
        return e => {
            e.stopPropagation();
            addMember(participant);
        }
    }

    function removeCurrentParticipant(participant) {
        return e => {
            e.stopPropagation();
            deleteParticipant(participant.uid);
        }
    }

    function manualAddParticipant() {
        const member = {
            uid: Date.now(),
            uname,
            avatar
        };
        addParticipant(member);
        setUname('');
    }

    function changeUname(e) {
        setUname(e.target.value);
    }

    return <div className="participants">
        <ul>
            <li>
                <input
                    style={{width: 135}}
                    placeholder="请输入昵称"
                    onChange={changeUname}
                />
                <button onClick={manualAddParticipant}>+</button>
            </li>
            {
                pList.map(participant => <li key={participant.uid} onClick={selectParticipant(participant)}>
                    <img src={participant.avatar} /><span>{participant.uname}</span>
                    <a className="remove" onClick={removeCurrentParticipant(participant)}></a>
                </li>)
            }
        </ul>
    </div>;
}
