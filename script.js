const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputeSlider = document.querySelector("[data-lengthSlider]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generatePassword");

const symbols = "`~!@#$%^&*()_+-=[{]};':,./<>?|"
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSilder();
allCheckbox.forEach( (checkbox) => {
    checkbox.checked = false;
});
setIndicator("#ccc");

// password ko ui me dikhata hai
function handleSilder() {
    inputeSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputeSlider.min;
    const max = inputeSlider.max;
    inputeSlider.style.backgroundSize = ( (passwordLength - min)*100/ (max-min)) + "% 100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInt(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function getRndNum() {
    return getRndInt(0, 9);
}

function getRndLowercase() {
    return String.fromCharCode(getRndInt(97, 123));
}

function getRndUppercase() {
    return String.fromCharCode(getRndInt(65, 91));
}

function getRndSymbol() {
    const rndNum = getRndInt(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(upperCheck.checked) hasUpper = true;
    if(lowerCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8) {
        setIndicator("green");
    } else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6) {
        setIndicator("yellow");
    } else {
        setIndicator("red");
    }
}

async function copyContent() {
    try {
        // returns promise
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

inputeSlider.addEventListener('input', (e) => {
    passwordLength = parseInt(e.target.value);
    handleSilder();
})

copybtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
})

function handleCheckboxCount() {
    checkCount=0;
    allCheckbox.forEach( (checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });
    // special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSilder();
    }
}
allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxCount);
})



// Password generate
function shufflePassword(arr) {
    // for(let i=0; i<arr.length; i++) {
    //     console.log(arr[i]+" ");
    // }
    // Fisher Yates Method
    for(let i = arr.length-1; i>=0; i--) {
        // random j
        const j = Math.floor(Math.random() * i);
        // swapping
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str="";
    arr.forEach((el) => (str += el));
    // console.log("Final string: "+str);
    return str;
}

generatebtn.addEventListener("click", () => {
    // none of the checkbox are selected
    if(checkCount<=0) {
        // console.log("retruned");
        return;
    }

    if(passwordLength<checkCount) {
        passwordLength = checkCount;
        handleSilder();
    }
    // console.log("Starting");
    // real game starts here
    password = "";

    // pela je je kidhu hoy enu ek ek add kar daiye
    // if(upperCheck.checked) {
    //     password += getRndUppercase();
    // }
    // if(lowerCheck.checked) {
    //     password += getRndLowercase();
    // }
    // if(numberCheck.checked) {
    //     password += getRndNum();
    // }
    // if(symbolsCheck.checked) {
    //     password += getRndSymbol();
    // }

    let funcArr = [];
    if(upperCheck.checked) {
        funcArr.push(getRndUppercase);
    }

    if(lowerCheck.checked) {
        funcArr.push(getRndLowercase);
    }

    if(numberCheck.checked) {
        funcArr.push(getRndNum);
    }

    if(symbolsCheck.checked) {
        funcArr.push(getRndSymbol);
    }
    
    // console.log("array created");

    // mandatory wale yha se liye
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    // console.log("Mandatory done");
    // length cover krne ke liye yha se add kiye
    for(let i=0; i<passwordLength - funcArr.length; i++) {
        let rndIdx = getRndInt(0, funcArr.length);
        // console.log("Index"+rndIdx);
        password += funcArr[rndIdx]();
    }
    // console.log("Remaianing done");
    // finally shuffling the password

    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calc strength
    calcStrength();
})


