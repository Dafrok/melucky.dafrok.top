/**
 * @file helpers
 * @author Dafrok
 */

import cardImg from '../resources/card.png';

export function shuffle(source) {
    const ary = source.concat();
    let times = ary.length;
    while (times) {
        ary.push(ary.splice(0 | Math.random() * times, 1)[0]);
        times--;
    }
    return ary;
}

export function createMock(num) {
    const data = [];
    const timeStamp = +new Date();
    for (let i = 0; i < num; i++) {
        const uid = timeStamp - Math.floor(Math.random() * timeStamp);
        data.push({
            uid,
            uname: `Melody-${uid}`,
            avatar: cardImg,
            selected: false,
            sign: parseInt(Math.random() * 4, 10),
            number: parseInt(Math.random() * 13, 10)
        });
    }
    return data;
}

export function checkSign(members, sign) {
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

export function checkNumber(members, number) {
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

export function checkIfOnlySign(members) {
    const m = members.filter(member => !member.dead);
    return !m.some(item => item.sign !== m[0].sign);
}

export function checkIfOnlyNumber(members) {
    const m = members.filter(member => !member.dead);
    return !m.some(item => item.number !== m[0].number);
}
