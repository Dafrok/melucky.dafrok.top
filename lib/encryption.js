/**
 * @file helper
 * @author Dafrok
 */

import pako from 'pako';

const textEncoder = new TextEncoder('utf-8');
const textDecoder = new TextDecoder('utf-8');

function readInt(buffer, start, len) {
    let result = 0;
    for (let i = len - 1; i >= 0; i--) {
        result += Math.pow(256, len - i - 1) * buffer[start + i];
    }
    return result;
}

function writeInt(buffer, start, len, value) {
    let i = 0;
    while (i < len) {
        buffer[start + i] = value / Math.pow(256, len - i - 1);
        i++;
    }
}

export function encode(str, op) {
    let data = textEncoder.encode(str);
    let packetLen = 16 + data.byteLength;
    let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1];
    writeInt(header, 0, 4, packetLen);
    return (new Uint8Array(header.concat(...data))).buffer;
}

export function decode(blob) {
    return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let buffer = new Uint8Array(e.target.result);
            let result = {
                packetLen: readInt(buffer, 0, 4),
                headerLen: readInt(buffer, 4, 2),
                ver: readInt(buffer, 6, 2),
                op: readInt(buffer, 8, 4),
                seq: readInt(buffer, 12, 4)
            };
            if (result.op === 5) {
                result.body = [];
                let offset = 0;
                while (offset < buffer.length) {
                    let packetLen = readInt(buffer, offset + 0, 4);
                    let headerLen = 16;
                    let data = buffer.slice(offset + headerLen, offset + packetLen);
                    let body = '';
                    try {
                        body = textDecoder.decode(pako.inflate(data));
                    }
                    catch (e) {
                        body = textDecoder.decode(data);
                    }
                    let ary = [];
                    let flag = false;
                    for (let i = 0; i < body.length; i++) {
                        if (flag) {
                            if (body[i] === '{') {
                                flag = false;
                            }
                            else {
                                continue;
                            }
                        }
                        else if (!body[i].charCodeAt()) {
                            if (!flag) {
                                flag = true;
                                ary.push('\u0000');
                                continue;
                            }
                        }
                        ary.push(body[i]);
                    }
                    body = ary.join('');
                    if (body) {
                        const group = body.split(/[\u0000]/g);
                        group.forEach(item => {
                            try {
                                result.body.push(JSON.parse(item));
                            }
                            catch(e) {
                                // 忽略非 JSON 字符串，通常情况下为分隔符
                            }
                        });
                    }

                    offset += packetLen;
                }
            }
            else if (result.op === 3) {
                result.body = {
                    count: readInt(buffer, 16, 4)
                };
            }
            resolve(result);
        };
        reader.readAsArrayBuffer(blob);
    });
}
