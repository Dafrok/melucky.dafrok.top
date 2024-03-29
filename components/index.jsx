/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import Connection from '../lib/connection';
import Playground from './playgrond';
import Winner from './winner';
import Header from './header';
import Participants from './participants';
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
import { getAllParticipants, setParticipant, removeParticipant } from '../lib/storage';
import { Poker } from '../lib/poker';

const {useState, useEffect, useMemo} = React;

export default function app() {
    const [roomId, setRoomId] = useState(null);
    // const [connectionState, setConnectionState] = useState(0);
    const [winner, setWinner] = useState(null);
    // const [danmu, setDanmu] = useState([]);
    const [members, setMembers] = useState([]);
    const [enableSignUp, setEnableSignUp] = useState(false);
    const [gift, setGift] = useState(30649);
    const [participants, setParticipants] = useState(getAllParticipants());

    function addParticipant(participant) {
        participants[participant.uid] = participant;
        setParticipants({...participants});
        setParticipant(participant);
    }

    function deleteParticipant(uid) {
        delete participants[uid];
        setParticipants({...participants});
        removeParticipant(uid);
    }

    function startSignUp() {
        setEnableSignUp(true);
    }

    function stopSignUp() {
        setRoomId(null);
        setEnableSignUp(false);
        setMembers(shuffle(members));
    }

    const connection = useMemo(() => {
        if (!roomId) {
            return;
        }
        return new Connection({roomId})
    }, [roomId, gift]);

    if (connection) {
        connection.onConnect = function () {
            startSignUp();
        };
        connection.onDisconnect = function () {
            stopSignUp();
        };
        connection.onReconnect = function () {
            stopSignUp();
            setRoomId(roomId);
        }
        connection.onDanmu = function (res) {
            // setMembers(members.concat());
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
            console.log('#Gift: ', gift, res.data.giftName, res.data.giftId, gift === res.data.giftId);
            if (gift != 0 && res.data.giftId !== gift) {
                return;
            }
            const {uid, uname, face} = res.data;
            // console.log('#gifted', res.data);
            if (members.find(member => member.uid === uid)) {
                return;
            }
            const member = {
                uid,
                uname,
                avatar: face
            };
            addParticipant(member);
            addMember(member);
        };
    }

    useEffect(() => {
        if (!connection) {
            return;
        }
        connection.connect();
        return connection.disconnect;
    }, [roomId, gift])

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
        if (member.winner) {
            member.award = true;
            member.winner = false;
        }
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

    function killRandom() {
        const currentMembers = members.filter(member => !member.dead)
        if (!currentMembers.length) {
            return;
        }
        currentMembers[parseInt(Math.random() * currentMembers.length, 10)].dead = true;
        setMembers(members.concat());
        checkDead(members);
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
        const currentMembers = members.filter(member => !member.dead);
        if (currentMembers.length === 1) {
            const winner = currentMembers[0];
            winner.winner = true;
            setMembers(members.concat());
        }
        if (currentMembers.length === 0) {
            const winner = members.find(member => member.award)
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

    function addMember(participant) {
        if (members.find(member => member.uid === participant.uid)) {
            return setMembers(members.concat());;
        }
        members.push(new Poker(participant));
        setMembers(members.concat());
    }

    return <div>
        <Header
            enableSignUp={enableSignUp}
            roomId={roomId}
            changeRoom={changeRoom}
            clean={clean}
            addMember={addMember}
            changeGift={changeGift}
            gift={gift}
        />
        <Participants
            participants={participants}
            addParticipant={addParticipant}
            deleteParticipant={deleteParticipant}
            addMember={addMember}
        />
        <div className="main">
            <div className="toolbar">
                <Killer show onClick={() => setMembers(shuffle(members))}>洗牌</Killer>
                {/* {
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
                } */}
                <Killer show={members.filter(member => !member.dead).length > 1} onClick={killHalf}>1/2</Killer>
                <Killer show onClick={killRandom}>随机</Killer>
            </div>
            <Playground
                killById={killById} 
                members={members}
                enableSignUp={enableSignUp}
            />
        </div>
        <SignUp gift={gift} members={members} enableSignUp={enableSignUp} />
        <Winner winner={winner} reset={reset} clean={clean} />
    </div>;
}
