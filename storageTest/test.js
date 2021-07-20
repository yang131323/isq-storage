import { one } from './text.js';

function testStorage (str, opts = {}) {
    let num = 1;
    const storage = opts.type === 'local' ? window.localStorage : window.sessionStorage;
    const nums = opts.nums || 1000;
    const result = [];
    const performance = window.performance;
    for (let i = 1 ; i <= nums; i++) {
        // const key = `__storage_${opts.type ? opts.type + '_' : ''}${num}`;
        const startTime = performance.now();
        // console.time(key);
        storage.setItem('key', str);
        // console.timeEnd(key);
        const endTime = performance.now();
        result.push(endTime - startTime);
        storage.clear();
        num++;
    }
    let allTime = 0;
    for (const time of result) {
        allTime += time;
    }
    return allTime / result.length;
}

function testSessionStorage (len, nums) {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += one;
    }
    const key = `sesstionStorage-test-${len}`;
    console.time(key);
    console.log(`__${key}: `, testStorage(str, { nums: nums || 50 }));
    console.timeEnd(key);
}

function testLocalStorage (len, nums) {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += one;
    }
    const key = `localStorage-test-${len}`
    console.time(key);
    console.log(`__${key}: `, testStorage(str, { nums: nums || 50, type: 'local' }));
    console.timeEnd(key);
}

testSessionStorage(1);
testSessionStorage(2);
testSessionStorage(3);
testSessionStorage(4);
testSessionStorage(5);

testLocalStorage(1);
testLocalStorage(2);
testLocalStorage(3);
testLocalStorage(4);
testLocalStorage(5);
