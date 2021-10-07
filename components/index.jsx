/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import Connection from '../lib/connection';
import Playground from './playgrond';
import Winner from './winner';
import Header from './header';
import SignUp from './sign-up';
import {signs, numbers} from '../lib/config';
import {
    shuffle,
    checkIfOnlyNumber,
    checkIfOnlySign,
    checkNumber,
    checkSign
} from '../lib/helper';
import './index.styl';
import Killer from './killer';

const {useState, useRef, useEffect, useMemo} = React;

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

export default function app() {
    const [roomId, setRoomId] = useState(null);
    // const [connectionState, setConnectionState] = useState(0);
    const [winner, setWinner] = useState(null);
    // const [danmu, setDanmu] = useState([]);
    const [members, setMembers] = useState([]);
    const [enableSignUp, setEnableSignUp] = useState(false);
    const [gift, setGift] = useState(30649);

    function startSignUp() {
        setEnableSignUp(true);
    }

    function stopSignUp() {
        setEnableSignUp(false);
        setMembers(shuffle(members));
    }

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const connection = new Connection({roomId});
        connection.onConnect = function () {
            startSignUp();
            // setConnectionState(1);
        };
        connection.onDisconnect = function () {
            stopSignUp();
            // setConnectionState(0);
        };
        connection.onDanmu = function (res) {
            setMembers(members.concat());
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
        };
        connection.onGift = function (res) {
            // 20004: 吃瓜
            // res.data.giftId === 30607 小心心
            // res.data.giftId === 30649 泡泡机
            console.log('#Gift: ', gift, res.data.giftId, res.data.giftName, gift === res.data.giftId);
            if (gift != 0 && res.data.giftId !== gift) {
                return;
            }
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
            setMembers(members.concat());
        };
        connection.connect();
        return connection.disconnect;
    }, [roomId, gift]);

    const isOnlySign = useMemo(() => checkIfOnlySign(members), [members]);
    const isOnlyNumber = useMemo(() => checkIfOnlyNumber(members), [members]);

    function changeRoom(str) {
        if (!str) {
            enableSignUp ? stopSignUp() : startSignUp();
            return setRoomId(str);
        }
        const id = parseInt(str, 10);
        if (Number.isNaN(id)) {
            const url = new URL(str);
            return setRoomId(url.pathname.slice(1));
        }
        return setRoomId(id);
    }

    function killById(uid) {
        const member = members.find(member => member.uid === uid);
        member.dead = true;
        setMembers(members.concat());
        checkDead(members);
    }

    function killBySign(sign) {
        return () => {
            members.forEach(member => {
                if (member.sign === sign) {
                    member.dead = true;
                }
            });
            setMembers(members.concat());
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
            setMembers(members.concat());
            checkDead(members);
        };
    }

    function killHalf() {
        const half = shuffle(members.filter(item => !item.dead));
        half.slice(Math.floor(half.length / 2))
            .forEach(member => {
                member.dead = true;
            });
        setMembers(members.concat());
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
            setWinner(winner);
        }
    }

    function reset() {
        setWinner(null);
        const newMembers = shuffle(members).map(member => new Poker(member));
        setMembers(newMembers.concat());
    }

    function clean() {
        setWinner(null);
        setMembers([]);
    }

    function changeGift(e) {
        setGift(parseInt(e.target.value, 10));
    }

    return <div>
        <Header
            enableSignUp={enableSignUp}
            roomId={roomId}
            changeRoom={changeRoom}
            clean={clean}
            members={members}
            setMembers={setMembers}
            changeGift={changeGift}
            gift={gift}
        />
        <div className="main">
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
                <Killer show={members.filter(member => !member.dead).length > 1} onClick={killHalf}>1/2</Killer>
            </div>
            <Playground
                killById={killById} 
                members={members}
            />
        </div>
        <SignUp gift={gift} members={members} enableSignUp={enableSignUp} />
        <Winner winner={winner} reset={reset} clean={clean} />
    </div>;
}
