/**
 * @file header
 * @author Dafrok
 */

import * as React from 'react';
import {createMock} from '../../lib/helper';

const {useRef} = React;

export default function header({members, enableSignUp, roomId, setMembers, changeRoom, clean}) {

    function mock() {
        const newMembers = createMock(10);
        setMembers(members.concat(newMembers));
    }

    const $ref = useRef(null);

    return <nav className="navbar has-shadow is-dark">
        <div className="navbar-brand">
            <div className="navbar-item">
                <h1 className="title has-text-white">MELucky</h1>
            </div>
        </div>
        <div className="navbar-end">
            <div className="navbar-item">
                <div className="control">
                    {
                        (enableSignUp && !roomId)
                            ? <button className="button is-small is-link" onClick={mock}>报名10个假观众（测试用）</button>
                            : null
                    }
                </div>
            </div>
            <div className="navbar-item">
                <form className="field has-addons" onSubmit={e => {
                        e.preventDefault();
                        changeRoom($ref.current.value);
                    }}
                >
                    <div className="control">
                        <input
                            defaultValue={roomId}
                            ref={$ref}
                            type="text"
                            className="input is-small"
                            placeholder="直播间地址"
                        />
                    </div>
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
                            <button type="submit" className="button is-small is-link">开启报名</button>
                        </div>
                    }
                    <div className="control">
                        <button
                            className="button is-small is-danger"
                            type="button"
                            disabled={enableSignUp}
                            onClick={
                                e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    clean();
                                }
                            }
                        >清空</button>
                    </div>
                </form>
            </div>
        </div>
    </nav>;
}
