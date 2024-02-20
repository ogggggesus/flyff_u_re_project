import { parseMessage, fuzzBytes } from "./utils.js";
import { getPacketIfIsKnown } from "./known-packets.js";

//const result = parseMessage(`1f1800000018a226ad788fe732305efc4160debdb5b89519827be08ee9686c84fe`); // punch, 2nd int32 - 'dc', 'aa', '77', '00'
//const result = parseMessage(`1f2f0000008ad02b871b8fe7320a4754045b7702f73f2122c766b6221ef1c6dffe2e7e8f87895572d3e0c872a9770b8e562e90e597dd01c9`); // heal, 2nd int32 - 'e7', '03', 'c8', '42',
//const result = parseMessage(`1f2f0000003691183b1b8fe732296a54047f6000f7c3e122c766b66c57f1c6dffe2e7e8f87895572d3e0c872a9770b8eec0095d3177cd5dd`); // heal on fence
const result = parseMessage(`1f2f0000005ac535db1b8fe732b52c54045b7702f77ebd22c766b69908f1c682fe2e7e8f87895572d3e0c872a9770b8e156a07363963e7ec`); // stonehand, 2nd int32 - 'e7', '03', 'c8', '42',
//const result = parseMessage(`1f27 0000 00ae e5d1 081b 8fe7 32bd 4088 075b 7702 f761 b61e c766 b4cd 1bf1 c6db d81f 3d8f 8789 559a 05ce d378 bf9c 9b38`); // move wasd, 2nd int32 - 'e7', '03', 'c8', '42',

//console.log("Packet type: ", result.messageIdHex, getPacketIfIsKnown(result.messageId));
console.log(result);
//console.log(result.messageData);
console.log(result.messageData.length);
console.log(fuzzBytes(result.messageData));
//console.log(fuzzBytes(result.messageDataXored).utf8.length);