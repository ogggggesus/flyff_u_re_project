import { parseMessage, fuzzBytes, findConstValuesPerIndex, bytesToInt32LittleEndian, findByteSequence } from "./utils.js";
import { getPacketIfIsKnown } from "./known-packets.js";

import fs from "fs";

function base64ToByteArray(base64String) {
    // Create a buffer from the Base64 string
    const buffer = Buffer.from(base64String, "base64");

    // Convert the buffer to a byte array
    const byteArray = new Uint8Array(buffer);

    return byteArray;
}

function checkForLengthPrefix(p) {
    const lenUint8 = p.messageData[0];
    let lenInt32
    try {
    lenInt32 = bytesToInt32LittleEndian(p.messageData.slice(0, 4));
    } catch {}

    return (
        p.messageData.length === lenUint8 ||
        p.messageData.length - 1 === lenUint8 ||
        p.messageData.length === lenInt32 ||
        p.messageData.length - 1 === lenInt32
    );
}

try {
    // Path to your file
    const filePath = "../wsDumps/board, blinkwing to flaris, equip unequip, shops.har";

    // Read file synchronously
    const rawData = fs.readFileSync(filePath, "utf8");

    // Parse the JSON content
    const jsonData = JSON.parse(rawData);

    // jsonData now contains the parsed JSON object
    //console.log(Object.keys(jsonData));
    let packets = jsonData["_webSocketMessages_world"].map((jo) => jo.data);
    //console.log(packets)

    let packetIds = {};
    packets = [...packets].map((p) => parseMessage(base64ToByteArray(p)));
    [...packets].forEach((p) => {
        if(p.sender === "server") return;

        if (!packetIds[p.messageIdHex]) {
            packetIds[p.messageIdHex] = { count: 0, sender: p.sender };
        }

        packetIds[p.messageIdHex].count += 1;
    });

    Object.keys(packetIds).forEach((id) => {
        let idAsInt = Number(id);
        packetIds[id].type = getPacketIfIsKnown(idAsInt, packetIds[id].sender === "client", false)?.name;
    });

    Object.keys(packetIds).forEach((id) => {
        let idAsInt = Number(id);
        const { count, type, sender } = packetIds[id];

        if (!type) {
            // search packets for some utf8 or pattern
            packets
                .filter((p) => p.messageIdHex === id)
                .forEach((p) => {
                    let utf8Fuzz = fuzzBytes(p.messageData).utf8.replace(/[^\x00-\x7F]/g, "");
                    if (utf8Fuzz.length > 0) {
                        //console.log(`Found possible UTF8 for ${id}: ${utf8Fuzz}`);
                    }
                });
            if (
                packets
                    .filter((p) => p.messageIdHex === id)
                    .every((p) => {
                        return checkForLengthPrefix(p);
                    })
            ) {
                console.log(`Found message prefixed with length byte`);
            }
        }
    });

    console.log(packetIds);
    //console.log(packets.find(p => p.messageData.length == 0))

    // Check utf8 for a packet
    //let test = packets.filter((p) => p.messageId === 0x00000100);
    //console.log(test);
    //console.log(test.map(t => fuzzBytes(t.messageData).utf8));

    // Check lengths for a packet and look for const values
    let test = packets.filter((p) => p.messageId === 0x646ab876);
    //test = test.filter((p) => p.messageData.length === 51);
    console.log(test);
    console.log(test.map(t => fuzzBytes(t.messageData).utf8));
    //console.log(test.map(t => t.messageData.length));
    console.log(`const values found for ${test[0].messageIdHex} length any: { index: val } `, findConstValuesPerIndex(test.map(t => t.messageData)));

    //console.log("Looking for byte sequence [60, 0, 0, 0]", findByteSequence(packets, [ 60, 0, 0, 0 ]))

    let numPacketTypes = Object.keys(packetIds).length;
    let numKnown = Object.keys(packetIds).filter((id) => packetIds[id].type != null).length;
    console.log(
        `${numPacketTypes} ids received in dump. ${numKnown} known, ${numPacketTypes - numKnown} unknown. ${((numKnown / numPacketTypes) * 100).toFixed(
            2
        )}% coverage.`
    );
} catch (error) {
    console.error("Error reading or parsing the file:", error);
}
