/**
 * @file Card
 * @author Dafrok
 */

import * as React from 'react';
import Card from '../card';

export default function playground({members, killById, enableSignUp}) {
    return <div className="playground">
        {
            members.map(item => <Card key={item.uid} {...item}
                enableSignUp={enableSignUp}
                onClick={() => killById(item.uid)}
            />)
        }
    </div>
    ;
}
