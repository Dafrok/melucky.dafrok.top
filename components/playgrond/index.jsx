/**
 * @file Card
 * @author Dafrok
 */

import * as React from 'react';
import Card from '../card';

export default function playground({members, killById}) {
    return <div className="playground">
        {
            members.map(item => <Card key={item.uid} {...item}
                onClick={() => killById(item.uid)}
            />)
        }
    </div>
    ;
}
