export function getPacketIfIsKnown(messageId, isFromClient = true, isForLogin = false) {
    let foundPacketType = null;
    //console.log(KNOWN_PACKETS)
    //console.log(messageId)
    Object.keys(KNOWN_PACKETS).forEach((pName) => {
        let packetType = KNOWN_PACKETS[pName];
        let packetTypeIsClient = packetType.client || !packetType.server;
        let packetTypeIsLogin = packetType.login;
        if (packetType.id === messageId && packetTypeIsClient == isFromClient && !!packetTypeIsLogin === !!isForLogin) {
            foundPacketType = { ...KNOWN_PACKETS[pName], name: pName };
        }
    });
    return foundPacketType;
}

// types
const NULL_T = 0;
const UINT8_T = 1;
const UINT32_T = 2;
const STRING_T = 3;

const CLIENT_SEND_CHAT = {
    id: 0x009c6a64,
    client: true,
    dataStructure: [
        {
            len: 1,
            name: "Chat string length",
            type: UINT8_T,
        },
        {
            len: 3,
            name: "Starting null bytes", // These could likely be the other 3 bytes for an int32 for the chat string length. but it never goes above 130 or so so not used.
            type: NULL_T,
        },
        {
            len: (totalDataLength) => totalDataLength - 12,
            name: "String data",
            type: STRING_T,
        },
        {
            len: 8,
            name: "Ending null bytes",
            type: NULL_T,
        },
    ],
};

const SERVER_SEND_CHAT = {
    id: 0x009c6a64,
    client: true,
};

const CLIENT_IDENTIFY_WORLD = {
    id: 0x00000100,
    client: true,
    description: `
    Looks like it sends browser info. User agent string:
    \x03\x01\x00\x00\x00\f\x10\x00\x16\x17ce\x05YU�\x05\x00\x00\x00\x01(\x00\x00\x00bYOETfk9qTFYU_JtjrH5UoO3O0HLklGpn306fWCk�\x00\x00\x00WD Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 - ID qjQVWXIFCrY\x05\x00\x00\x00en-US'
    `,
};
const CLIENT_IDENTIFY_WORLD_2 = {
    id: 0x00000103,
    client: true,
    description: `
    Looks like some other identify packet
    `,
};
const CLIENT_START_AND_STOP_TYPING = {
    id: 0x646a9c4e,
    client: true,
    description: `
    1 byte long, 0x01 for start typing and 0x00 for stop.
    `,
};

const SERVER_NPC_CHAT_1 = {
    id: 0x646aac87,
    server: true,
    description: `
    One of those packets which has a bunch of strings in different languages
    `,
};
const SERVER_NPC_CHAT_2 = {
    id: 0x646aac06,
    server: true,
};
const SERVER_NPC_CHAT_3 = {
    id: 0x646aac03,
    server: true,
};
const SERVER_NPC_CHAT_4 = {
    id: 0x646aac0d,
    server: true,
};
const SERVER_NPC_CHAT_5 = {
    id: 0x646aac2a,
    server: true,
};
const SERVER_NPC_CHAT_6 = {
    id: 0x646aac18,
    server: true,
};
const SERVER_NPC_CHAT_7 = {
    id: 0x646aac17,
    server: true,
};
const SERVER_NPC_CHAT_8 = {
    id: 0x646aac02,
    server: true,
};
const SERVER_NPC_DIALOG = {
    id: 0x646aac0f,
    server: true,
};
const SERVER_MISC_INFO_1 = {
    id: 0x646aac21,
    server: true,
    description: `Not a lot of UTF-8 in these packets but I do see "No Cash" and "Glory" in one`,
};
const SERVER_ULTIMATE_WEAPON_LINKS = {
    id: 0x646aac00,
    server: true,
};

const SERVER_HAD_MY_USERNAME_BEFORE = {
    id: 0x646aac01,
    server: true,
};

const SERVER_FRIENDS_ONLINE = {
    id: 0x646a9c06,
    server: true,
};

const SERVER_UI_INFO = {
    id: 0x646aac7f,
    server: true,
    description: `Looks to display various UI info about leveling? Maybe promotional?
    'ids_ui_create_ultimate_weapon"ids_ui_create_ultimate_weapon_descp=Gere"ids_ui_create_ultimate_weapon_lvl1/(jg"ids_ui_create_ultimate_weapon_lvl2/(jg"ids_ui_create_ultimate_weapon_lvl3/(jg"ids_ui_create_ultimate_weapon_lvl4/j"ids_ui_create_ultimate_weapon_lvl5
    ids_ui_upgradepass ids_ui_battlepass_novAe ids_ui_halloweenpass9eW`,
};

const CLIENT_QUEST_INFO = {
    id: 0x646ab813,
    client: true,
    description: `
    looks like some info sent from client? maybe for quests or npc interactions?
    [
        '\x00\x00\x00\x00B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
        '\x0B\x00\x00\x00QUEST_BEGINB\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00l\x00\x00\x00',
        '\x0F\x00\x00\x00QUEST_BEGIN_YESB\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00l\x00\x00\x00',
        '\x00\x00\x00\x006\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
        '\x12\x00\x00\x00QUEST_END_COMPLETE6\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00S\x00\x00\x00',
        '\x0F\x00\x00\x00QUEST_BEGIN_YES6\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00T\x00\x00\x00'
      ]
    `,
};

const CLIENT_USE_ITEM = {
    id: 0x646ab810,
    client: true,
    length: 8,
    description: `
    This looks like it uses an item from an inventory slot, from index 0 starting at top left of inventory. whichever item it is depends on which slot i put it in in inventory`,
    dataStructure: [
        {
            len: 4,
            name: "Inventory slot number",
            type: UINT32_T,
        },
        {
            len: 4,
            name: "Ending null bytes",
            type: NULL_T,
        },
    ],
};

const CLIENT_DROP_ITEM = {
    id: 0x646a9c04,
    client: true,
    length: 8,
    description: `
    Drop item numbered by slot`,
    dataStructure: [
        {
            len: 4,
            name: "Inventory slot number",
            type: UINT32_T,
        },
        {
            len: 4,
            name: "Ending null bytes",
            type: NULL_T,
        },
    ],
};

const CLIENT_MAYBE_PING = {
    id: 0x00000100,
    client: true,
    length: [0, 4], // looks to alternate between 0 and 4 every message?
    description: `I recorded this one previously, that it was getting sent by me periodically. it is sometimes completely empty in data section. other times 4 length, a uint8 padded with 3 nulls at end.`,
};

const CLIENT_MAYBE_PING_2 = {
    id: 0x646ab807,
    client: true,
    description: `What else could this be besides a ping? it's always 9 bytes long, with 4 of them 0x00 and the last is a 0x00 or 0x01`,
};

const CLIENT_MOVEMENT = {
    id: 0x646ab804,
    client: true,
    length: [27, 35, 43, 51],
    description: `
    Looks like this is some array of 32 bit numbers, maybe integer maybe float. I see some pattern in the bytes, some nulls are in the same place and maybe some const will take some experimenting though

    This might also be used for skills too, i see it triggering when I heal with length 43

    35 length is WASD & jumping
    43 length is flying
    51 length is click to move
    
    const values found for 0x646ab804 length 27: { index: val }  {
        '2': 217,
        '3': 69,
        '6': 200,
        '7': 66,
        '11': 69,
        '12': 90,
        '13': 0,
        '16': 0,
        '17': 0,
        '18': 17
      }

      const values found for 0x646ab804 length 35: { index: val }  {
        '3': 69,
        '11': 69,
        '12': 90,
        '13': 1,
        '16': 0,
        '17': 0,
        '22': 0,
        '23': 0,
        '24': 0,
        '25': 0
      }

      const values found for 0x646ab804 length 43: { index: val }  {
        '3': 69,
        '11': 69,
        '12': 90,
        '13': 3,
        '16': 0,
        '17': 0,
        '22': 0,
        '23': 0,
        '24': 0,
        '25': 0,
        '30': 0,
        '31': 0,
        '32': 0,
        '33': 0
      }

      const values found for 0x646ab804 length 51: { index: val }  {
        '3': 69,
        '11': 69,
        '12': 90,
        '13': 7,
        '16': 0,
        '17': 0,
        '21': 69,
        '22': 0,
        '23': 0,
        '24': 0,
        '25': 0,
        '30': 0,
        '31': 0,
        '32': 0,
        '33': 0,
        '37': 69,
        '38': 0,
        '39': 0,
        '40': 0,
        '41': 0,
        '42': 0
      }

    messageData: [
        98, 243, 216,  69, 231,   3, 200,  66, 232,  10, 75,
        69,  90,   7,  95,  27,   0,   0, 216, 168, 216, 69,
         0,   0,   0,   0, 231,   3, 200,  66,   0,   0,  0,
         0,  61, 138,  74,  69,   0,   0,   0,   0,   0, 13,
       207,  30, 145, 179, 108, 237, 245
     ],
      messageData: [
        95, 191, 216, 69, 231,   3, 200,  66, 39,
       177,  74,  69, 90,   1, 169,  27,   0,  0,
        54,   0,   0,  0,   0,   0,   0,   0,  4,
       170, 115, 164, 83,  70,  33, 182, 115
     ],
     messageData: [
        95, 191, 216, 69, 231,   3, 200,  66, 39,
       177,  74,  69, 90,   1, 169,  27,   0,  0,
         1,   0,   0,  0,   0,   0,   0,   0, 17,
       134, 236, 239, 30,  53, 132,  84, 250
     ],
      `,
};

/// ----- login

const LOGIN_CLIENT_HELLO = {
    client: true,
    login: true,
    id: 0x00000101,
};
const LOGIN_SERVER_HELLO = {
    server: true,
    login: true,
    id: 0x00000100,
};
const LOGIN_SERVER_GIVE_CHANNEL_INFO = {
    server: true,
    login: true,
    id: 0x00000104,
};
const LOGIN_SERVER_PING = {
    server: true,
    login: true,
    id: 0x646aac14,
};

export const KNOWN_PACKETS = {
    CLIENT_SEND_CHAT,
    CLIENT_IDENTIFY_WORLD,
    CLIENT_IDENTIFY_WORLD_2,
    CLIENT_MAYBE_PING,
    CLIENT_USE_ITEM,
    CLIENT_DROP_ITEM,
    CLIENT_MOVEMENT,
    CLIENT_START_AND_STOP_TYPING,
    CLIENT_QUEST_INFO,
    CLIENT_MAYBE_PING_2,

    SERVER_NPC_CHAT_1,
    SERVER_NPC_CHAT_2,
    SERVER_NPC_CHAT_3,
    SERVER_NPC_CHAT_4,
    SERVER_NPC_CHAT_5,
    SERVER_NPC_CHAT_6,
    SERVER_NPC_CHAT_7,
    SERVER_NPC_CHAT_8,
    SERVER_MISC_INFO_1,
    SERVER_NPC_DIALOG,
    SERVER_ULTIMATE_WEAPON_LINKS,
    SERVER_UI_INFO,
    SERVER_HAD_MY_USERNAME_BEFORE,
    SERVER_FRIENDS_ONLINE,
    SERVER_SEND_CHAT,

    LOGIN_CLIENT_HELLO,
    LOGIN_SERVER_HELLO,
    LOGIN_SERVER_PING,
    LOGIN_SERVER_GIVE_CHANNEL_INFO,
};