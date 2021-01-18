/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import Connection from '../lib/connection';
import Card from './card';
import Winner from './winner';
import cardImg from '../resources/card.png'
import {signs, numbers} from '../lib/config';
import {shuffle} from '../lib/helper'
import './index.styl';
import Killer from './killer';

const {useState, useRef, useEffect, useMemo} = React;

function createMock(num) {
    const data = [];
    for (let i = 0; i < num; i++) {
        data.push({
            uid: Math.random(),
            uname: `Melody-${+new Date()}`,
            avatar: cardImg,
            selected: false,
            sign: parseInt(Math.random() * 4, 10),
            number: parseInt(Math.random() * 13, 10),
        })
    }
    return data;
}

class Poker {
    constructor({uid, uname, avatar}) {
        this.uid = uid;
        this.uname = uname;
        this.avatar = avatar,
        this.selected = false;
        this.sign = parseInt(Math.random() * 4, 10);
        this.number = parseInt(Math.random() * 13, 10);
        this.dead = false;
    }
}

function checkSign(members, sign) {
    let sum = 0;
    let winner = null;
    for (let member of members) {
        if (!member.dead && member.sign === sign) {
            winner = member;
            sum++;
        }
    }
    return !!sum;
}

function checkNumber(members, number) {
    let sum = 0;
    let winner = null;
    for (let member of members) {
        if (!member.dead && member.number === number) {
            winner = member;
            sum++;
        }
    }
    return !!sum;
}

function checkIfOnlySign(members) {
    const m = members.filter(member => !member.dead);
    return !m.some(item => item.sign !== m[0].sign);
}

function checkIfOnlyNumber(members) {
    const m = members.filter(member => !member.dead);
    return !m.some(item => item.number !== m[0].number);
}

export default function app() {
    const [roomId, setRoomId] = useState(null);
    const [connectionState, setConnectionState] = useState(0);
    const [winner, setWinner] = useState(null);
    // const [danmu, setDanmu] = useState([]);
    const [members, setMembers] = useState([]);
    const [enableSignUp, setEnableSignUp] = useState(false);

    const $ref = useRef(null);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const connection = new Connection({roomId});
        connection.onConnect = function () {
            setEnableSignUp(true);
            setConnectionState(1);
        }
        connection.onDisconnect = function () {
            setEnableSignUp(false);
            setConnectionState(0);
        }
        connection.onDanmu = function (res) {
            setMembers([...members]);
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
            // res.data.giftId === 30607 小心心
            const {uid, uname, face} = res.data;
            // console.log('#gifted', res.data);
            if (members.find(member => member.uid === uid)) {
                return;
            }
            members.push(new Poker({
                uid,
                uname,
                avatar: face
            }));
            setMembers([...members]);
        }
        connection.connect();
        return connection.disconnect;
    }, [roomId]);

    const isOnlySign = useMemo(() => checkIfOnlySign(members), [members]);
    const isOnlyNumber = useMemo(() => checkIfOnlyNumber(members), [members]);

    function changeRoom(str) {
        if (!str) {
            setEnableSignUp(!enableSignUp);
            return setRoomId(str);
        }
        const id = parseInt(str);
        if (Number.isNaN(id)) {
            const url = new URL(str);
            return setRoomId(url.pathname.slice(1));
        }
        return setRoomId(id);
    }

    function killById(uid) {
        const member = members.find(member => member.uid === uid);
        member.dead = true;
        setMembers([...members]);
        checkDead(members);
    }

    function killBySign(sign) {
        return () => {
            members.forEach(member => {
                if (member.sign === sign) {
                    member.dead = true;
                }
            });
            setMembers([...members]);
            checkDead(members);
        };
    }

    function killByNumber(number) {
        return () => {
            members.forEach(member => {
                if (member.number === number) {
                    member.dead = true;
                }
            });
            setMembers([...members]);
            checkDead(members);
        };
    }

    function killHalf() {
        const half = shuffle(members.filter(item => !item.dead))
        half.slice(parseInt(half.length / 2, 10))
            .forEach(member => {
                member.dead = true;
            });
        setMembers([...members]);
        checkDead(members);
    }

    function checkDead(members) {
        let sum = 0;
        let winner = null;
        for (let member of members) {
            if (!member.dead) {
                winner = member;
                sum++;
            }
        }
        if (sum === 1) {
            setWinner(winner)
        }
    }

    function reset() {
        setWinner(null);
        const newMembers = shuffle(members).map(member => new Poker(member));
        setMembers([...newMembers]);
    }

    function clean() {
        setWinner(null);
        setMembers([])
    }

    function mock() {
        const newMembers = createMock(10);
        setMembers(members.concat(newMembers));
    }

    return <div>
        <nav className="navbar has-shadow is-dark">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <h1 className="title has-text-white">MELucky</h1>
                </div>
            </div>
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="control">
                        {
                            (enableSignUp && !roomId) ? <button className="button is-small is-link" onClick={mock}>报名10个假观众（测试用）</button> : null
                        }
                    </div>
                </div>
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
                                <button className="button is-small is-link">开启报名</button>
                            </div>
                        }
                        <div className="control">
                            <button className="button is-small is-danger" onClick={clean}>清空</button>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
        <div className="toolbar">
            {
                signs.map((item, index) => <Killer
                    key={index}
                    show={!isOnlySign && checkSign(members, index)}
                    onClick={killBySign(index)}
                >
                    {item}
                </Killer>)
            }
            {
                numbers.map((item, index) => <Killer
                    key={index}
                    show={!isOnlyNumber && checkNumber(members, index)}
                    onClick={killByNumber(index)}
                >
                    {item}
                </Killer>)
            }
            <Killer show={true} onClick={killHalf}>1/2</Killer>
        </div>
        <div className="playground">
            {
                members.map(item => <Card key={item.uid} {...item}
                    onClick={e => killById(item.uid)}
                />)
            }
        </div>
        <Winner winner={winner} reset={reset} />
        {/* <div>
            {danmu.map((item, index) => <div key={index}>{item.uname}：{item.text}</div>)}
        </div> */}
    </div>;
}
