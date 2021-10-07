/**
 * @file sign up
 * @author Dafrok
 */

import * as React from 'react';
import {gifts} from '../../lib/config';
import loadingImg from '../../resources/loading.gif';
import './style.styl';

export default function signUp({enableSignUp, members, gift = 0}) {
    const giftId = gift;
    const currentGift = React.useMemo(() => {
        return gifts.find(gift => gift.value === giftId)
    }, [giftId]);
    return enableSignUp ? <div className="sign-up-mask">
        <p><img src={loadingImg} /></p>
        <p>投喂<span className="gift-name">{currentGift.name}</span>就能{members.length ? `和 ${members.length} 位马里兰乐园的小伙伴一起` : null}参加抽奖，快来报名哟 ♪</p>
    </div> : null;
}
