const dobRef = document.querySelector("#dob");
const btnRef = document.querySelector("#checkbtn");
const outputBoxRef = document.querySelector(".outputBox");
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function showMessage(msg) {
    outputBoxRef.innerHTML = msg;
}

function reverseStr(str) {
    return str.split("").reverse().join("");
}

function isPalindrome(str) {
    return reverseStr(str) === str;
}

function convertDateToStr(date) {
    return {
        day: date.day < 10 ? "0" + date.day : date.day.toString(),
        month: date.month < 10 ? "0" + date.month : date.month.toString(),
        year: date.year.toString(),
    };
}

function getAllDateFormats({ day, month, year }) {
    const dateStrs = [
        `${day}${month}${year}`, // DDMMYYYY
        `${month}${day}${year}`, // MMDDYYYY
        `${year}${month}${day}`, // YYYYMMDD
        `${day}${month}${year.slice(-2)}`, // DDMMYY
        `${month}${day}${year.slice(-2)}`, // MMDDYY
        `${year.slice(-2)}${month}${day}` // YYMMDD
    ];
    return dateStrs;
}

function isLeapYear(year) {
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
}

function getNextDate(date) {
    let day = date.day + 1;
    let month = date.month;
    let year = date.year;

    if (month === 2) {
        if (isLeapYear(year) && day > 29) {
            day = 1;
            month = 3;
        } else if (!isLeapYear(year) && day > 28) {
            day = 1;
            month = 3;
        }
    } else {
        if (day > daysInMonth[month - 1]) {
            day = 1;
            month++;
        }
    }

    if (month > 12) {
        month = 1;
        year++;
    }

    return { day, month, year };
}

function getNextPalindromeDate(date) {
    let nextDate = getNextDate(date);
    let counter = 0;
    while (true) {
        counter++;
        let dateStr = convertDateToStr(nextDate);
        let allDateFormats = getAllDateFormats(dateStr);
        for (let format of allDateFormats) {
            if (isPalindrome(format)) {
                return [counter, dateStr];
            }
        }
        nextDate = getNextDate(nextDate);
    }
}

function getPreviousDate(date) {
    let day = date.day - 1;
    let month = date.month;
    let year = date.year;

    if (day === 0) {
        month--;
        if (month === 0) {
            day = 31;
            month = 12;
            year--;
        } else if (month === 2) {
            day = isLeapYear(year) ? 29 : 28;
        } else {
            day = daysInMonth[month - 1];
        }
    }

    return { day, month, year };
}

function getPreviousPalindromeDate(date) {
    let prevDate = getPreviousDate(date);
    let counter = 0;
    while (true) {
        counter++;
        let dateStr = convertDateToStr(prevDate);
        let allDateFormats = getAllDateFormats(dateStr);
        for (let format of allDateFormats) {
            if (isPalindrome(format)) {
                return [counter, dateStr];
            }
        }
        prevDate = getPreviousDate(prevDate);
    }
}

function checkIfDateIsPalindrome(dob) {
    const dateStr = convertDateToStr(dob);
    const allDateFormats = getAllDateFormats(dateStr);
    const isPalindromeFlag = allDateFormats.some(isPalindrome);

    if (isPalindromeFlag) {
        showMessage("🎉 Your birthdate is a palindrome!");
    } else {
        const [daysToNext, nextDate] = getNextPalindromeDate(dob);
        const [daysToPrev, prevDate] = getPreviousPalindromeDate(dob);

        const daysLeft = Math.min(daysToNext, daysToPrev);
        const nearestDate = daysToNext < daysToPrev ? nextDate : prevDate;

        showMessage(`The nearest palindrome date is ${nearestDate.day}-${nearestDate.month}-${nearestDate.year}, you missed by ${daysLeft} ${daysLeft < 2 ? 'day' : 'days'}. 😔`);
    }
}

function processingPalindrome(dob) {
    const gifLoader = document.querySelector('.anim');
    gifLoader.style.display = "block";
    
    setTimeout(() => {
        checkIfDateIsPalindrome(dob);
        gifLoader.style.display = "none";
    }, 3000);
}

function clickHandler() {
    const dobString = dobRef.value;
    showMessage("");
    
    if (dobString) {
        const dobArray = dobString.split("-");
        const dob = {
            day: Number(dobArray[2]),
            month: Number(dobArray[1]),
            year: Number(dobArray[0]),
        };
        processingPalindrome(dob);
    } else {
        showMessage("Date of birth is required! 😠");
    }
}

btnRef.addEventListener("click", clickHandler);
