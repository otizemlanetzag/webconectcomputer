// הוסף את הקוד הזה בתוך namespace WebLink

/**
 * מקשיב לכל הודעת רדיו נכנסת ומעביר אותה באופן אוטומטי לאפליקציה/אינטרנט
 * @param secure האם להעביר כשיחה מאובטחת, eg: true
 */
//% block="העבר רדיו לרשת (Bridge)"
export function bridgeRadioToWeb(): void {
    // האזנה לכל מחרוזת רדיו נכנסת
    radio.onReceivedString(function (receivedString: string) {
        // שליחה מידית ל-Serial כדי שהאפליקציה תעלה את זה לענן
        serial.writeLine("BRIDGE:" + receivedString);

        // אינדיקציה ויזואלית קטנה על המיקרוביט שהועבר מידע
        led.plot(2, 2);
        basic.pause(100);
        led.unplot(2, 2);
    });

    // האזנה לכל מספר רדיו נכנס
    radio.onReceivedNumber(function (receivedNumber: number) {
        serial.writeLine("BRIDGE:" + receivedNumber.toString());
        led.plot(2, 2);
        basic.pause(100);
        led.unplot(2, 2);
    });
}
