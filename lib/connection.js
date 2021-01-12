/**
 * @file connection
 * @author Dafrok
 */

import {encode, decode} from './encryption';

function fetchRoomIdByUserId(userId) {
    // https://api.live.bilibili.com/room/v2/Room/room_id_by_uid?uid=
    return fetch();
}

export default class Connection {
    constructor({
        roomId = '',
        userId = '',
        serviceUrl = 'wss://broadcastlv.chat.bilibili.com/sub'
    }) {
        this.serviceUrl = serviceUrl;
        this.roomId = parseInt(roomId, 10);
        this.userId = userId;
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }
    onOpen() {
        console.log('websocket opened');
        this.onConnect && this.onConnect();
        const ws = this.connection;
        const roomid = this.roomId;
        ws.send(encode(JSON.stringify({
            roomid
        }), 7));
        this.heartbeatId = setInterval(function () {
            ws.send(encode('', 2));
        }, 30000);
    }
    onClose() {
        console.log('websocket closed');
        this.onDisconnect && this.onDisconnect();
        clearInterval(this.heartbeatId);
    }
    async onMessage(msgEvent) {
        const packet = await decode(msgEvent.data);
        switch (packet.op) {
            case 8: {
                console.log('加入房间');
                break;
            }
            case 3: {
                const count = packet.body.count;
                console.log(`人气：${count}`);
                break;
            }
            case 5: {
                packet.body.forEach(body => {
                    switch (body.cmd) {
                        case 'DANMU_MSG': {
                            // console.log(`${body.info[2][1]}: ${body.info[1]}`);
                            this.onDanmu && this.onDanmu(body);
                            break;
                        }
                        case 'SEND_GIFT': {
                            // console.log(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
                            this.onGift && this.onGift(body);
                            break;
                        }
                        case 'WELCOME': {
                            // console.log(`欢迎 ${body.data.uname}`);
                            break;
                        }
                        // 此处省略很多其他通知类型
                        default: {
                            // console.log(body);
                        }
                    }
                });
                break;
            }
            default: {
                // console.log(packet);
            }
        }
    }
    disconnect() {
        this.disconnected = true;
        this.connection && this.connection.close();
    }
    async connect() {
        if (!this.roomId && this.userId) {
            this.roomId = await fetchRoomIdByUserId(this.userId);
        }
        if (this.disconnected) {
            return;
        }
        this.connection = new WebSocket(this.serviceUrl);
        this.connection.onopen = this.onOpen;
        this.connection.onclose = this.onClose;
        this.connection.onmessage = this.onMessage;
    }
}
