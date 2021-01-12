/**
 * @file root component
 * @author Dafrok
 */
import * as React from 'react';
import Connection from '../lib/connection';

const {useState, useRef, useEffect} = React;

export default function app() {
    const [roomId, setRoomId] = useState(null);

    const $ref = useRef(null);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const connection = new Connection({roomId});
        connection.connect();
        return connection.disconnect;
    }, [roomId]);

    return <div>
        <label>房间号：<input defaultValue={roomId} ref={$ref} type="text" /></label>
        <button onClick={e => setRoomId($ref.current.value)}>连接</button>
        <button onClick={e => setRoomId(null)}>断开连接</button>
    </div>;
}
