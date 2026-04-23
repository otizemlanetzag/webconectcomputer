enum RadioFormat {
    //% block="טקסט"
    String,
    //% block="מספר"
    Number,
    //% block="מנגינה"
    Melody,
    //% block="נתון (Name:Value)"
    NameValue
}

//% color="#007ACC" icon="\uf1eb" block="RADIO+"
namespace RadioPlus {
    let lastHandled = false;

    //% block="כשמתקבל %format בשם %value | בצע:"
    //% handlerStatement=1
    export function onReceivedSpecial(format: RadioFormat, value: string, handler: () => void) {
        radio.onReceivedString(function (receivedString: string) {
            if ((format == RadioFormat.String && receivedString == value) ||
                (format == RadioFormat.NameValue && receivedString.split(":")[0] == value)) {
                lastHandled = true;
                handler();
            }
        });
        radio.onReceivedNumber(function (receivedNumber: number) {
            if ((format == RadioFormat.Number || format == RadioFormat.Melody) && receivedNumber == parseInt(value)) {
                lastHandled = true;
                handler();
            }
        });
    }

    //% block="כשמתקבל נתון אחר | בצע:"
    //% handlerStatement=1
    export function onReceivedOther(handler: () => void) {
        radio.onReceivedString(function (receivedString: string) {
            if (!lastHandled) { handler(); }
            lastHandled = false;
        });
    }

    //% block="כשנשלח %format בשם %value | בצע:"
    //% handlerStatement=1
    export function onDataSent(format: RadioFormat, value: string, handler: () => void) {
        control.onEvent(101, 1, function () { handler(); });
    }

    //% block="שלח ב-RADIO+ נתון בשם %name עם ערך %val"
    export function sendNameValue(name: string, val: string) {
        radio.sendString(name + ":" + val);
        control.raiseEvent(101, 1);
    }

    //% block="שלח ב-RADIO+ %format : %val"
    export function sendSpecific(format: RadioFormat, val: string) {
        if (format == RadioFormat.String) { radio.sendString(val); }
        else { radio.sendNumber(parseInt(val)); }
        control.raiseEvent(101, 1);
    }
}

//% color="#2ecc71" icon="\uf0ac" block="WEB-LINK"
namespace WebLink {

    // --- בלוקי שלט רחוק ספציפיים ---
    function onRemote(cmd: string, handler: () => void) {
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let line = serial.readLine();
            if (line.trim() == "REMOTE:" + cmd) { handler(); }
        });
    }

    //% block="כשכפתור אפליקציה ⬆️ נלחץ"
    //% handlerStatement=1
    export function onUp(handler: () => void) { onRemote("UP", handler); }

    //% block="כשכפתור אפליקציה C נלחץ"
    //% handlerStatement=1
    export function onC(handler: () => void) { onRemote("C", handler); }

    //% block="כשכפתור אפליקציה בשם %name נלחץ"
    //% handlerStatement=1
    export function onCustom(name: string, handler: () => void) { onRemote(name, handler); }

    // --- בלוקי אינטרנט וזהות ---
    //% block="תן שם למיקרוביט: %name"
    export function setName(name: string) { serial.writeLine("SET_NAME:" + name); }

    //% block="שיחה: %status"
    export function setStatus(status: boolean) { serial.writeLine("SET_STATUS:" + (status ? "OPEN" : "CLOSED")); }

    //% block="חפש באינטרנט: %query"
    export function webSearch(query: string) { serial.writeLine("SEARCH:" + query); }

    //% block="כשמתקבל נתון מהאינטרנט | בצע:"
    //% handlerStatement=1
    //% draggableParameters="reporter"
    export function onWeb(handler: (data: string) => void) {
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let line = serial.readLine();
            if (line.includes("WEB:")) { handler(line.replace("WEB:", "")); }
        });
    }

    // --- בלוקי ניטור וגרפים ---
    //% block="שלח נתונים לאפליקציה: שם %label ערך %value"
    export function sendToApp(label: string, value: number) { serial.writeLine("LOG:" + label + ":" + value); }

    //% block="נקה גרף באפליקציה"
    export function clearGraph() { serial.writeLine("CMD:CLEAR"); }

    serial.redirectToUSB();
}

/**
* Gebruik dit bestand om specifieke functies en blokken te definiëren.
* Lees meer op https://makecode.microbit.org/blocks/custom
*/

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace custom {
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    export function foo(n: number, s: string, e: MyEnum): void {
        // Add code here
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    export function fib(value: number): number {
        return value <= 1 ? value : fib(value -1) + fib(value - 2);
    }
}
