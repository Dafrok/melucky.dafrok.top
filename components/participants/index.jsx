/**
 * @file Card
 * @author Dafrok
 */

import * as React from 'react';
import { getAllParticipants } from '../../lib/storage';
import './style.styl';
 
export default function participants({addMember}) {
    const participants = getAllParticipants();
    const pList = Object.values(participants);

    function selectParticipant(participant) {
        return e => {
            e.stopPropagation();
            addMember(participant);
        }
    }

    return <div className="participants">
        <ul>
            {
                pList.map(participant => <li key={participant.uid} onClick={selectParticipant(participant)}>
                    <img src={participant.avatar} /><span>{participant.uname}</span>
                </li>)
            }
        </ul>
    </div>;
}
