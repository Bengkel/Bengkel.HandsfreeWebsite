var subscriptionKey = "{your-speech-api-key}";
var serviceRegion = "westeurope";
var speechRecognitionLanguage = "en-US";

// status fields and start button in UI
var phraseDiv;
var startRecognizeOnceAsyncButton;
var authorizationToken;
var SpeechSDK;
var recognizer;

let commandReg = /^hey link it|hey link, it/i;

document.addEventListener("DOMContentLoaded", function () {
    startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
    phraseDiv = document.getElementById("phraseDiv");

    startRecognizeOnceAsyncButton.addEventListener("click", function () {
        startRecognizeOnceAsyncButton.disabled = true;
        startRecognizeOnceAsyncButton.classList.add("record");
        phraseDiv.innerHTML = "";

        // if we got an authorization token, use the token. Otherwise use the provided subscription key
        var speechConfig;
        if (authorizationToken) {
            speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion);
        } else {
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        }

        speechConfig.speechRecognitionLanguage = speechRecognitionLanguage;

        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
            function (result) {

                startRecognizeOnceAsyncButton.disabled = false;
                startRecognizeOnceAsyncButton.classList.remove("record");
                startRecognizeOnceAsyncButton.classList.add("ready");

                if (commandReg.test(result.text)) {
                    voiceCommand(result.text);
                }

                phraseDiv.innerHTML += result.text;
                window.console.log(result);

                recognizer.close();
                recognizer = undefined;

            },
            function (err) {
                recognizer.close();
                recognizer = undefined;
                startRecognizeOnceAsyncButton.disabled = false;
                startRecognizeOnceAsyncButton.classList.remove("record");

                phraseDiv.innerHTML += err;
                window.console.log(err);
            });
    });

    function voiceCommand(command) {
        command = command
            .replace(commandReg, "")
            .replace(",", "")
            .toLowerCase();
        console.log("command:" + command);

        if (command.includes("go to") || command.includes("goto")) {
            command = command.replace("go", "")
                             .replace("to", "")
                             .replace(".", "")
                             .replace(/ /g, '');

            var selector = "a[href='#" + command.toLowerCase() + "']";
            console.log("navigate to:" + selector);

            var hyperlink = document.querySelectorAll(selector)[0];

            if (!!hyperlink) {
                hyperlink.click();
                console.log("Click");
            }
        }

        if (command.includes("change to") || command.includes("changeto") || command.includes("changed to") || command.includes("changedto")) {
            var commandOption = command.replace("changed", "")
                             .replace("change", "")
                             .replace("to", "")
                             .replace(".", "")
                             .replace(/ /g, '');

            console.log("change to:" + commandOption);

            switch (commandOption) {
                case "gray":
                    document.getElementById("sideNav").classList.remove('bg-primary');
                    document.getElementById("sideNav").classList.add('gray');
                    break;
                case "black":
                    document.getElementById("sideNav").classList.remove('gray');
                    document.getElementById("sideNav").classList.add('bg-primary');
                    break;
                case "square":
                    document.getElementById("startRecognizeOnceAsyncButton").classList.remove('rounded-circle');
                    break;
                case "circle":
                    document.getElementById("startRecognizeOnceAsyncButton").classList.add('rounded-circle');
                    break;
                default:
                    console.log("command option unknown: " + commandOption);
                    break;
            }
        }
    }

    if (!!window.SpeechSDK) {
        SpeechSDK = window.SpeechSDK;
        startRecognizeOnceAsyncButton.disabled = false;

        document.getElementById('warning').style.display = 'none';

        // in case we have a function for getting an authorization token, call it.
        if (typeof RequestAuthorizationToken === "function") {
            RequestAuthorizationToken();
        }
    }

    if (!subscriptionKey !== '')
    {
        document.getElementById('key').style.display = 'none';
    }
});
