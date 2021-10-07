/**
 * @file Card
 * @author Dafrok
 */

import * as React from 'react';
import './style.styl';
 
export default function participants({participants, addParticipant, deleteParticipant, addMember}) {
    const pList = Object.values(participants);

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

    return <div className="participants">
        <ul>
            {
                pList.map(participant => <li key={participant.uid} onClick={selectParticipant(participant)}>
                    <img src={participant.avatar} /><span>{participant.uname}</span>
                    <a className="remove" onClick={removeCurrentParticipant(participant)}></a>
                </li>)
            }
        </ul>
    </div>;
}
