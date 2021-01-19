/**
 * @file header
 * @author Dafrok
 */

import * as React from 'react';
import {createMock} from '../../lib/helper';
import './header.styl';

const {useRef} = React;

export default function header({members, enableSignUp, roomId, setMembers, changeRoom, clean}) {

    function mock() {
        const newMembers = createMock(10);
        setMembers(members.concat(newMembers));
    }

    const $ref = useRef(null);

    return <nav className="header">
        <form className="field has-addons" onSubmit={e => {
                e.preventDefault();
                changeRoom($ref.current.value);
            }}
        >
            <div className="control is-expanded">
                <input
                    defaultValue={roomId}
                    ref={$ref}
                    type="text"
                    className="input is-small is-fullwidth"
                    placeholder="直播间地址"
                />
            </div>
            {
                (enableSignUp && !roomId)
                    ? <div className="control">
                            <button
                                className="button is-small"
                                type="button"
                                onClick={mock}
                            >
                                模拟报名
                            </button>
                        </div>
                    : null
            }
            {
                enableSignUp
                    ? <div className="control">
                        <button className="button is-small" onClick={
                            e => {
                                e.preventDefault();
                                e.stopPropagation();
                                changeRoom(null);
                            }}
                        >
                            结束报名
                        </button>
                    </div>
                    : <div className="control">
                    <button type="submit" className="button is-small">开启报名</button>
                </div>
            }
            <div className="control">
                <button
                    className="button is-small is-danger"
                    type="button"
                    disabled={enableSignUp}
                    onClick={clean}
                >清空</button>
            </div>
        </form>
    </nav>;
}
