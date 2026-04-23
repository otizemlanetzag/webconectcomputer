namespace WebLink {
    let lastAnswer = ""; // משתנה פנימי ששומר את התשובה האחרונה

    /**
     * מחזיר את התשובה האחרונה שהתקבלה מהאינטרנט (Web Answer)
     */
    //% block="ANSWER"
    //% blockId=web_answer_reporter
    export function getWebAnswer(): string {
        return lastAnswer;
    }

    // מעדכן את בלוק ה-onDataReceived כדי שישמור את התשובה בתוך lastAnswer
    //% block="כשמתקבל נתון מהאינטרנט | בצע:"
    //% handlerStatement=1
    //% draggableParameters="reporter"
    export function onDataReceived(handler: (data: string) => void) {
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let received = serial.readLine();
            if (received.includes("WEB:")) {
                let cleanData = received.replace("WEB:", "");
                lastAnswer = cleanData; // שמירת הנתון לבלוק העגול
                handler(cleanData);
            }
        });
    }

    // ... שאר הבלוקים של WebLink (setName, requestData, webSearch וכו') ...
}
