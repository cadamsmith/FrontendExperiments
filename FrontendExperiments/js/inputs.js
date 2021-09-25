var elements = document.getElementsByClassName("dollar-amount-no-sign");

Array.from(elements).forEach(function (el) {
    el.addEventListener('keydown', beforeInputDollarAmount);
    //el.addEventListener("focusout", onFocusOutInputDollarAmount);
});

function beforeInputDollarAmount(e) {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        return;
    }

    e.preventDefault();

    if (e.key == "Backspace") {
        onDeletePriceInput(e);
    }
    else if (e.key == "." || isWholeNumeric(e.key)) {
        handleInsert(e);
    }
}

function handleInsert(e) {
    var data = e.key.replaceAll(/[^0-9\.]+/g, "");

    var el = e.currentTarget;
    var selectStart = el.selectionStart;
    var selectEnd = el.selectionEnd;

    var oldPrice = el.value;

    var oldDollarsAndCents = oldPrice.split(".");
    if (oldDollarsAndCents.length > 2) {
        console.log("Invalid State!");
        return;
    }

    var oldDollars = oldDollarsAndCents[0];
    var oldCents = oldDollarsAndCents.length == 2 ? oldDollarsAndCents[1] : "";

    var newPrice = oldPrice.substring(0, selectStart) + data + oldPrice.substring(selectEnd);

    var newDollarsAndCents = newPrice.split(".");
    if (newDollarsAndCents.length > 2) {
        console.log("More than one decimal");
        return;
    }

    var newDollars = newDollarsAndCents[0].replaceAll(",", "").replace(/^0+/, "");
    var newCents = newDollarsAndCents.length == 2 ? newDollarsAndCents[1].replaceAll(",", "") : "";
    if (newDollars.length < 1)
    {
        newDollars = "0";
    }
    else if (newDollars.length > 7) {
        console.log("Dollars greater than 7");
        return;
    }

    var newSelectStart = 0;

    if (selectStart <= oldDollars.length) {
        var leftOfSelectLength = (oldPrice.substring(0, selectStart) + data).replaceAll(",", "").length;

        if (newCents.length > 0) {
            newPrice = getCommaFixedNumeric(newDollars) + "." + newCents;
        }
        else if (newDollarsAndCents.length == 2) {
            newPrice = getCommaFixedNumeric(newDollars) + ".";
        }
        else {
            newPrice = getCommaFixedNumeric(newDollars);
        }

        var i = 0;
        var j = 0;
        while (i < leftOfSelectLength) {
            if (newPrice[j] != ",") {
                i++;
            }

            newSelectStart++;
            j++;
        }
    }
    else {
        var leftOfSelectLength = oldPrice.substring(0, selectStart).length + data.length;
        if (leftOfSelectLength > 12) {
            leftOfSelectLength = 12;
        }

        newSelectStart = leftOfSelectLength;

        if (newCents.length > 0) {
            newPrice = oldDollars + "." + newCents.substring(0, 2);
        }
        else {
            newPrice = oldDollars;
        }
    }

    el.value = newPrice;
    el.selectionStart = newSelectStart;
    el.selectionEnd = newSelectStart;
}

function onInsertPriceInput(e) {
    e.preventDefault();

    let input = e.key.replaceAll(/[^0-9\.]+/g, "");

    let curValue = e.currentTarget.value;

    let removeStart = e.currentTarget.selectionStart;
    let removeEnd = e.currentTarget.selectionEnd;

    var newValue = curValue.substring(0, removeStart) + input + curValue.substring(removeEnd);

    let numberParts = newValue.split(".");
    if (numberParts.length > 2) {
        return;
    }

    let leftSide = numberParts[0].replaceAll(",", "").replace(/^0+/, "");
    if (leftSide.length < 1) {
        leftSide = "0";
    }
    else if (leftSide.length > 7) {
        return;
    }

    if (numberParts.length == 2) {
        let rightSide = numberParts[1].replaceAll(",", "").substring(0, 2);

        newValue = getCommaFixedNumeric(leftSide) + "." + rightSide;
    }
    else {
        newValue = getCommaFixedNumeric(leftSide);
    }

    if (e.currentTarget.maxLength >= newValue.length) {
        e.currentTarget.value = newValue;
    }
}

function onDeletePriceInput(e) {
    let curValue = e.currentTarget.value;

    let removeStart = e.currentTarget.selectionStart;
    let removeEnd = e.currentTarget.selectionEnd;

    var newValue = curValue.substring(0, removeStart - 1) + curValue.substring(removeEnd);

    let numberParts = newValue.split(".");
    if (numberParts.length > 2) {
        return;
    }

    let leftSide = numberParts[0].replaceAll(",", "").replace(/^0+/, "");
    if (leftSide.length < 1 && newValue.length > 0) {
        leftSide = "0";
    }
    else if (leftSide.length > 7) {
        return;
    }

    if (numberParts.length == 2 && numberParts[1].length > 0) {
        let rightSide = numberParts[1].replaceAll(",", "").substring(0, 2);

        newValue = getCommaFixedNumeric(leftSide) + "." + rightSide;
    }
    else {
        newValue = getCommaFixedNumeric(leftSide);
    }

    if (e.currentTarget.maxLength >= newValue.length) {
        e.currentTarget.value = newValue;
    }
}

function isWholeNumeric(value) {
    return /^\d+$/.test(value);
}

function getCommaFixedNumeric(value) {
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function onFocusOutInputDollarAmount(e) {
    let curValue = e.currentTarget.value;

    if (curValue.length < 1) {
        return;
    }

    let numberParts = curValue.split(".");

    let leftSide = numberParts[0];

    var rightSide = "";
    if (numberParts.length == 1) {
        rightSide = "00";
    }
    else {
        rightSide = numberParts[1].padEnd(2, "0");
    }

    let newValue = leftSide + "." + rightSide;

    e.currentTarget.value = newValue;
}