let db = {};



function handleInput(cmd) {
    let input = cmd.split(' ');
    let command = input[0];
    let valueList = [];
    switch (command) {
        case 'SET':
            if (input.length !== 3) {
                throw new Error('SET should have 2 arguments');
            }
            setKeyValue(input[1], input[2]);
            return "Successfully set key " + input[1] + " to " + input[2];
        case 'GET':
            if (input.length !== 2) {
                throw new Error('GET should have 1 argument');
            }
            return getKeyValue(input[1]);
        case 'SADD':
            valueList = input.slice(2, input.length);
            sAdd(input[1], valueList);
            return "Add Successful";
        case 'SREM':
            valueList = input.slice(2, input.length);
            sRem(input[1], valueList);
            return "Remove Successful";

        case 'SMEMBERS':
            if (input.length !== 2) {
                throw new Error('SMEMBERS should have 1 argument');
            }
            return sMembers(input[1]);

        case 'SINTER':
            if (input.length <= 1) {
                throw new Error('SINTER should be in this format: SINTER [key1] [key2] [key3] ...');
            }
            valueList = input.slice(1, input.length);
            return sInter(valueList);

        case 'KEYS':
            if (input.length !== 1) {
                throw new Error('KEYS should have 0 argument');
            }
            return keys();

        case 'DEL':
            del(input[1]);
            return "Key " + input[1] + " removed";

        case 'EXPIRE':
            if (input.length != 3) {
                throw new Error('EXPIRE should have 2 argument');
            }
            if (Number.isNaN(input[2])) {
                throw new Error('EXPIRE should have 2nd argument as a number')
            }
            return expire(input[1], Number.parseInt(input[2]));

        case 'TTL':
            if (input.length != 2) {
                throw new Error('TTL should have 1 argument');
            }
            if (ttl(input[1]) === -1){
                return "Key expired";
            }
            if (ttl(input[1]) === 2){
                return "Key does not have expiration";
            }
            return ttl(input[1]);

        case 'SAVE':
            if (input.length != 1) {
                throw new Error('SAVE should have 0 argument')
            }
            save();
            return "Save Successful";

        case 'RESTORE':
            if (input.length != 1) {
                throw new Error('RESTORE should have 0 argument')
            }
            restore();
            return "Restore Successful";

        default:
            throw new Error('Command not found! Please try again!');
    }
}

//Functions on String
function setKeyValue(key, val) {

    db[key] = { value: val };

}

function getKeyValue(key) {
    checkIfExpired(key);

    if (db[key] === undefined) {
        throw new Error('Key Not Found');
    }
    return db[key].value;
}

//Functions on Sets
function sAdd(key, val) {
    if (db[key] === undefined){
        db[key] = {value: []};
    }
    if (checkIfExpired(key) === -1){
        db[key] = {value: []};
    }    
    if (!Array.isArray(db[key].value)) {
        throw new Error('This key stored a string, cannot SADD to string');
    }
    for (let i = 0; i < val.length; ++i){
        db[key].value.push(val[i]);
    }
}

function sRem(key, val) {
    checkIfExpired(key);
    if (db[key] === undefined) {
        throw new Error('Key Not Found');
    }
    if (!Array.isArray(db[key].value)){
        throw new Error(db[key] + ' is not a set. Cannot call SREM on non-set items');
    }
    db[key].value = db[key].value.filter(e => !val.includes(e));
}

function sMembers(key) {
    checkIfExpired(key);
    if (!Array.isArray(db[key].value)){
        throw new Error(db[key] + ' is not a set. Cannot call SMEMBERS on non-set items');
    }
    return db[key].value;
}

function sInter(keyList) {
    for (let i = 0; i < keyList.length; i++) {
        checkIfExpired(keyList[i]);
        if (db[keyList[i]] === undefined) {
            throw new Error('Key ' + keyList[i] + ' not found')
        }
        if (!Array.isArray(db[keyList[i]].value)){
            throw new Error(db[keyList[i]] + ' is not a set. Cannot call SINTER on non-set items');
        }
    }

    let result = [];
    for (let i = 0; i < keyList[0].length; i++) {
        let current = db[keyList[0]].value[i];
        let inAll = true;
        innerloop:
        for (let j = 1; j < keyList.length; j++) {
            if (!db[keyList[j]].value.includes(current)) {
                inAll = false;
                break innerloop;
            }
        }
        if (inAll) {
            result.push(current);
        }
    }
    return result;
}

//Data Expiration 

function keys() {
    let keyList = []
    for (var key in db) {
        checkIfExpired(key);
    }
    for (var key in db){
        keyList.push(key);
    }
    return keyList;
}

function del(key) {
    checkIfExpired(key);
    if (db[key] === undefined) {
        throw new Error('Key Not Found');
    }

    delete db[key];
}

function expire(key, expire) {
    checkIfExpired(key);
    if (db[key] === undefined) {
        throw new Error('Key Not Found');
    }
    checkIfExpired(key);

    db[key].expire = Date.now() + expire * 1000;
    return expire;
}

function ttl(key) {
    return checkIfExpired(key)/1000;

}
function checkIfExpired(key) {

    if (db[key] === undefined) {
        throw new Error('Key Not Found');
    }
    if (db[key].expire === undefined) {
        return -2;
    }
    if (db[key].expire < Date.now()) {
        delete db[key];
        return -1;
    }
    return db[key].expire - Date.now();
}
//Snapshot:
let mostRecent = "";
function save() {
    keys();
    mostRecent = JSON.stringify(db);
}

function restore() {
    db = JSON.parse(mostRecent);
}

export { handleInput }