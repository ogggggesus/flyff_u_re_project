const crcTable = [
    0, -227835133, -516198153, 324072436, -946170081, 904991772, 648144872, -724933397, -1965467441, 2024987596, 1809983544, -1719030981, 1296289744,
    -1087877933, -1401372889, 1578318884, 274646895, -499825556, -244992104, 51262619, -675000208, 632279923, 922689671, -996891772, -1702387808, 1760304291,
    2075979607, -1982370732, 1562183871, -1351185476, -1138329528, 1313733451, 549293790, -757723683, -1048117719, 871202090, -416867903, 357341890, 102525238,
    -193467851, -1436232175, 1477399826, 1264559846, -1187764763, 1845379342, -1617575411, -1933233671, 2125378298, 820201905, -1031222606, -774358714,
    598981189, -143008082, 85089709, 373468761, -467063462, -1170599554, 1213305469, 1526817161, -1452612982, 2107672161, -1882520222, -1667500394, 1861252501,
    1098587580, -1290756417, -1606390453, 1378610760, -2032039261, 1955203488, 1742404180, -1783531177, -878557837, 969524848, 714683780, -655182201, 205050476,
    -28094097, -318528869, 526918040, 1361435347, -1555146288, -1340167644, 1114974503, -1765847604, 1691668175, 2005155131, -2047885768, -604208612, 697762079,
    986182379, -928222744, 476452099, -301099520, -44210700, 255256311, 1640403810, -1817374623, -2130844779, 1922457750, -1503918979, 1412925310, 1197962378,
    -1257441399, -350237779, 427051182, 170179418, -129025959, 746937522, -554770511, -843174843, 1070968646, 1905808397, -2081171698, -1868356358, 1657317369,
    -1241332974, 1147748369, 1463399397, -1521340186, -79622974, 153784257, 444234805, -401473738, 1021025245, -827320098, -572462294, 797665321, -2097792136,
    1889384571, 1674398607, -1851340660, 1164749927, -1224265884, -1537745776, 1446797203, 137323447, -96149324, -384560320, 461344835, -810158936, 1037989803,
    781091935, -588970148, -1834419177, 1623424788, 1939049696, -2114449437, 1429367560, -1487280117, -1274471425, 1180866812, 410100952, -367384613,
    -112536529, 186734380, -538233913, 763408580, 1053836080, -860110797, -1572096602, 1344288421, 1131464017, -1323612590, 1708204729, -1749376582,
    -2065018290, 1988219213, 680717673, -621187478, -911630946, 1002577565, -284657034, 493091189, 238226049, -61306494, -1307217207, 1082061258, 1395524158,
    -1589280451, 1972364758, -2015074603, -1800104671, 1725896226, 952904198, -894981883, -638100751, 731699698, -11092711, 222117402, 510512622, -335130899,
    -1014159676, 837199303, 582374963, -790768336, 68661723, -159632680, -450051796, 390545967, 1230274059, -1153434360, -1469116676, 1510247935, -1899042540,
    2091215383, 1878366691, -1650582816, -741088853, 565732008, 854102364, -1065151905, 340358836, -433916489, -177076669, 119113024, 1493875044, -1419691417,
    -1204696685, 1247431312, -1634718085, 1828433272, 2141937292, -1916740209, -483350502, 291187481, 34330861, -262120466, 615137029, -691946490, -980332558,
    939183345, 1776939221, -1685949482, -1999470558, 2058945313, -1368168502, 1545135305, 1330124605, -1121741762, -210866315, 17165430, 307568514, -532767615,
    888469610, -962626711, -707819363, 665062302, 2042050490, -1948470087, -1735637171, 1793573966, -1104306011, 1279665062, 1595330642, -1384295599,
];

export function calculateChecksum(data) {
    let checksum = -1;

    for (let i = 0; i < data.length; i++) {
        let checksumCalc = checksum ^ data[i];
        checksumCalc = checksumCalc & 255;
        let crcLookup = crcTable[checksumCalc];

        let newChecksum = checksum >>> 8;
        newChecksum = newChecksum ^ crcLookup;
        checksum = newChecksum;
    }

    return checksum;
}

export function int32ToHexBytes(int32) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setInt32(0, int32, true); // true for little-endian
    const hexBytes = [];
    for (let i = 0; i < 4; i++) {
        hexBytes.push(("0" + view.getUint8(i).toString(16)).slice(-2));
    }
    return hexBytes;
}

export function bytesToInt32LittleEndian(bytes) {
    if (bytes.length !== 4) {
        throw new Error("Invalid byte array length. Must be exactly 4 bytes.");
    }
    return bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
}

export function bytesToInt32BigEndian(bytes) {
    if (bytes.length !== 4) {
        throw new Error("Invalid byte array length. Must be exactly 4 bytes.");
    }
    // Combine the bytes in big endian order and use bitwise operations
    return bytes[3] | (bytes[2] << 8) | (bytes[1] << 16) | (bytes[0] << 24);
}

function extractAndConcatenateHex(hexDump) {
    function isOnlyHex(s) {
        return /^[0-9a-fA-F]+$/.test(s);
    }
    return hexDump.split(" ").filter(isOnlyHex).join(" ");
}

export function parseHexString(hexString) {
    hexString = hexString.replaceAll(" ", "");
    return hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
}

export function numToHex2Digit(b) {
    return b.toString(16).length === 1 ? `0${b.toString(16)}` : b.toString(16);
}

export function bytesToHexInt(bytes) {
    return (
        "0x" +
        bytes
            .slice()
            .reverse()
            .map((b) => (b.toString(16).length === 1 ? `0${b.toString(16)}` : b.toString(16)))
            .join("")
    );
}

export function parseMessage(messageBytes) {
    if (typeof messageBytes === "string") {
        messageBytes = parseHexString(extractAndConcatenateHex(messageBytes));
        //console.log("Decoded bytes:");
        //console.log(messageBytes.map((b) => (b.toString(16).length === 1 ? "0" : "") + b.toString(16)));
    }

    let messageData = [...messageBytes.slice()];

    let serverOrClientByte = messageData.shift();

    let lenBytes = messageData.splice(0, 4);

    let checksumBytes = messageData.splice(0, 4);
    let checksumInt = bytesToInt32LittleEndian(checksumBytes);

    let isFromClient = serverOrClientByte === 0x1f;
    let isFromServer = serverOrClientByte === 0xb8;

    let messageDataXored = [...(isFromClient ? clientXorMessage(messageData) : serverXorMessage(messageData))];

    let matchedExpectedChecksum = calculateChecksum(messageDataXored) === checksumInt;

    let messageId = messageDataXored.splice(0, 4);
    let messageIdNotDecoded = messageData.splice(0, 4);

    const expectedLength = bytesToInt32LittleEndian(lenBytes);

    return {
        //checksumBytes,
        //checksumInt,
        //checksumBytesHexString: int32ToHexBytes(checksumInt),
        //lengthBytes: bytesToInt32LittleEndian(lenBytes),
        matchesExpectedLength: expectedLength === messageData.length + 4,
        matchedExpectedChecksum,
        sender: isFromClient ? "client" : "server",
        messageData: [...messageDataXored],
        messageDataAsHex: [...messageDataXored].map((b) => numToHex2Digit(b)),
        //messageIdBytes: messageId,
        messageId: bytesToInt32LittleEndian(messageId),
        messageIdHex: bytesToHexInt(messageId),
        //messageIdHexNotDecoded: bytesToHexInt(messageIdNotDecoded),
    };
}

export function fuzzBytes(bytes) {
    const buffer = new ArrayBuffer(bytes.length);
    const view = new Uint8Array(buffer);
    bytes.forEach((b, i) => (view[i] = b));

    const dataView = new DataView(buffer);

    // Helper function to safely try decoding as UTF-8
    function tryDecodeUtf8(bytes) {
        try {
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return null;
        }
    }

    // Function to create an array of 32-bit integers from the byte array
    function getInt32Array(bytes, littleEndian) {
        const intArray = [];
        for (let i = 0; i <= bytes.length - 4; i += 4) {
            intArray.push(dataView.getInt32(i, littleEndian));
        }
        return intArray;
    }

    // Function to create an array of 32-bit floats from the byte array
    function getFloat32Array(bytes, littleEndian) {
        const floatArray = [];
        for (let i = 0; i <= bytes.length - 4; i += 4) {
            floatArray.push(dataView.getFloat32(i, littleEndian));
        }
        return floatArray;
    }

    const results = {
        //rawBytes: bytes,
        utf8: tryDecodeUtf8(bytes),
        int32LittleEndian: getInt32Array(bytes, true),
        //int32BigEndian: getInt32Array(bytes, false),
        float32LittleEndian: getFloat32Array(bytes, true),
        //float32BigEndian: getFloat32Array(bytes, false),
    };

    return results;
}

export function findConstValuesPerIndex(arrays) {
    let consistentValues = {};

    if (arrays.length === 0) {
        return consistentValues;
    }

    // Find the length of the longest array
    let maxLength = arrays.reduce((max, arr) => Math.max(max, arr.length), 0);

    for (let i = 0; i < maxLength; i++) {
        let isConsistent = true;
        let value;

        for (let j = 0; j < arrays.length; j++) {
            if (i < arrays[j].length) {
                if (j === 0) {
                    value = arrays[j][i];
                } else if (arrays[j][i] !== value) {
                    isConsistent = false;
                    break;
                }
            } else {
                isConsistent = false;
                break;
            }
        }

        if (isConsistent) {
            consistentValues[i] = value;
        }
    }

    return consistentValues;
}

export function findByteSequence(packets, sequence) {
    let sequenceIndices = [];

    for (let i = 0; i < packets.length; i++) {
        let packet = packets[i];
        let messageData = packet.messageData;

        for (let j = 0; j <= messageData.length - sequence.length; j++) {
            let found = true;
            for (let k = 0; k < sequence.length; k++) {
                if (messageData[j + k] !== sequence[k]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                sequenceIndices.push({ packetId: packet.messageIdHex, sender: packet.sender, startIndex: j });
            }
        }
    }

    return sequenceIndices;
}

export function xorClone(data, xorArr, xorArrStartOffset = 0) {
    while (xorArrStartOffset < 0) {
        xorArrStartOffset += xorArr.length;
    }
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        const xorIndex = (xorArrStartOffset + i) % xorArr.length;
        result[i] = data[i] ^ xorArr[xorIndex];
    }
    return result;
}

const clientXorArr = [
    44, 31, 55, 141, 86, 136, 244, 139, 65, 188, 116, 202, 181, 0, 63, 110, 130, 60, 181, 6, 22, 241, 198, 243, 254, 46, 126, 143, 135, 137, 85, 141,
];
const serverXorArr = [
    213, 120, 245, 174, 186, 254, 56, 202, 164, 162, 103, 8, 88, 209, 214, 3, 211, 112, 8, 47, 243, 54, 204, 105, 82, 66, 165, 196, 166, 209, 182, 57,
];

export function clientXorMessage(messageDataBytes) {
    return xorClone(messageDataBytes, clientXorArr, 1);
}
export function serverXorMessage(messageDataBytes) {
    return xorClone(messageDataBytes, serverXorArr, -8);
}
