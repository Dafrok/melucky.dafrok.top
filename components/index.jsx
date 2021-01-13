/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import Connection from '../lib/connection';
import Card from './card';
import cardImg from '../resources/card.png'
import './index.styl';

const {useState, useRef, useEffect} = React;

function createMock(num) {
    const data = [];
    for (let i = 0; i < num; i++) {
        data.push({
            uid: Math.random(),
            uname: `mock-${i}`,
            avatar: cardImg,
            selected: false,
            sign: parseInt(Math.random() * 4, 10),
            number: parseInt(Math.random() * 13, 10),
        })
    }
    return data;
}

export default function app() {
    const [roomId, setRoomId] = useState(null);
    const [connectionState, setConnectionState] = useState(0);
    const [danmu, setDanmu] = useState([]);
    const [members, setMembers] = useState([
        ...createMock(100)
    ]);

    const $ref = useRef(null);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const connection = new Connection({roomId});
        connection.onConnect = function () {
            setConnectionState(1);
        }
        connection.onDisconnect = function () {
            setConnectionState(0);
        }
        connection.onDanmu = function (res) {
            // danmu.unshift({
            //     id: res.info[0][7],
            //     uid: res.info[2][0],
            //     uname: res.info[2][1],
            //     text: res.info[1]
            // });
            // if (danmu.length > 100) {
            //     danmu.pop();
            // }
            // setDanmu([...danmu]);

            // var utterThis = new SpeechSynthesisUtterance(`${res.info[2][1]}说: ${res.info[1]}`);
            // var synth = window.speechSynthesis;
            // synth.speak(utterThis);
        }
        connection.onGift = function (res) {
            console.log(res);
            if (res.data.giftId === 30607) {
                const {uid, uname, face} = res.data;
                members.push({
                    uid,
                    uname,
                    avatar: face,
                    selected: false
                });
                setMembers([...members]);
            }
        }
        connection.connect();
        return connection.disconnect;
    }, [roomId]);

    function changeRoom(str) {
        if (!str) {
            return setRoomId(str);
        }
        const id = parseInt(str);
        if (Number.isNaN(id)) {
            const url = new URL(str);
            return setRoomId(url.pathname.slice(1));
        }
        return setRoomId(id);
    }

    return <div>
        <nav className="navbar has-shadow is-fixed-top is-dark">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <h1 className="title has-text-white">MELucky</h1>
                </div>
            </div>
            <div className="navbar-end">
                <div className="navbar-item">
                    <form className="field has-addons" onSubmit={e => {e.preventDefault(); changeRoom($ref.current.value)}}>
                        <div className="control">
                            <input
                                defaultValue={roomId}
                                ref={$ref}
                                type="text"
                                className="input is-small"
                                type="text"
                                placeholder="直播间地址"
                            />
                        </div>
                        {
                            connectionState
                                ? <div className="control">
                                    <button className="button is-small" onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        changeRoom(null);}
                                    }>
                                        断开
                                    </button>
                                </div>
                                : <div className="control">
                                <button className="button is-small">连接</button>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </nav>
        <div className="playground">
            {
                members.map(item => <Card key={item.uid} {...item} onClick={e => {
                    item.selected = !item.selected;
                    setMembers([...members]);
                }} />)
            }
        </div>
        {/* <div>
            {danmu.map((item, index) => <div key={index}>{item.uname}：{item.text}</div>)}
        </div> */}
    </div>;
}
