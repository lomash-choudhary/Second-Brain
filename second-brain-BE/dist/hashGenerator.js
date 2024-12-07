"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashGenerator = void 0;
const hashGenerator = (len) => {
    let option = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let ans = "";
    let lengthOfOption = option.length;
    for (let i = 0; i < len; i++) {
        ans += option[Math.floor(Math.random() * lengthOfOption)];
    }
    return ans;
};
exports.hashGenerator = hashGenerator;
