/**
 * @file sign up
 * @author Dafrok
 */

import * as React from 'react';
import Loading from '../loading';
import './style.styl';

export default function loading({enableSignUp, members}) {
    return enableSignUp ? <div className="sign-up-mask">
        <p>报名进行中&nbsp;&nbsp;<Loading size={28} /></p>
        <p>参与人数：{members.length}</p>
        <p>投喂任意礼物参加抽奖</p>
    </div> : null;
}
