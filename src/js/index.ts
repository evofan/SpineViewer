let message: string = "abcde";
console.log(message);

import { main } from "./main";
const result: string = main(100);

document.querySelector("#result").textContent = result;
