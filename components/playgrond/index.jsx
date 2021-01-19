
import * as React from 'react';
import Card from '../card';

export default function playground({members, killById, enableSignUp}) {
    return <div className="playground">
        {
            members.map(item => <Card key={item.uid} {...item}
                onClick={e => killById(item.uid)}
            />)
        }
        {
            enableSignUp ? <div className="sign-up-mask">
                <p>报名进行中<br />投喂任意礼物参加抽奖</p>
            </div> : null
        }
    </div>;
}
