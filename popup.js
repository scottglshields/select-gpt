document.addEventListener("DOMContentLoaded", async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const inputElement = document.getElementById('input');
    const outputElement = document.getElementById('output');

    const getActiveTab = async () => {
        const tabs = await chrome.tabs.query({
            currentWindow: true,
            active: true
        });
        return tabs[0];
    };

    const showPopup = async (answer) => {
        let errorMessage = "Something went wrong. Please try again later.";
        if (answer !== "CLOUDFLARE" && answer !== "ERROR") {
            try {
                let res = await answer.split("data:");
                try {
                    const detail = JSON.parse(res[0]).detail;
                    outputElement.innerHTML = detail;
                    return;
                } catch (e) {
                    try {
                        res = res[1].trim();
                        if (res === "[DONE]") return;
                        answer = JSON.parse(res);
                        let final = answer.message.content.parts[0].replace(/\n/g,'<br>');
                        outputElement.innerHTML = final;
                        return;
                    } catch (e) {}
                }
            } catch (e) {}
        } else if (answer === "CLOUDFLARE") {
            inputElement.innerHTML = 'Log into <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a>, then try again. Redirecting...';
            await sleep(3000);
            chrome.tabs.create({url: "https://chat.openai.com/chat"});
            return;
        }
        outputElement.innerHTML = errorMessage;
    };

    const getData = async (selection) => {
        if (!selection.length == 0) {
            inputElement.innerHTML = selection;
            outputElement.innerHTML = "Loading ...";
            const port = chrome.runtime.connect();
            port.postMessage({question: selection});
            port.onMessage.addListener((msg) => showPopup(msg));
        } else {
            inputElement.innerHTML = "Please select some text from the webpage first.";
        }
    };

    const getSelectedText = async () => {
        const activeTab = await getActiveTab();
        chrome.tabs.sendMessage(activeTab.id, {type: "LOAD"}, getData);
    };

    getSelectedText();
});


// 	document.addEventListener("DOMContentLoaded", async () => {

//     const sleep = ms => new Promise(r => setTimeout(r, ms))

//     const getActiveTab = async () => {
//         const tabs = await chrome.tabs.query({
//             currentWindow: true,
//             active: true
//         })
//         return tabs[0]
//     }

//     const showPopup = async (answer) => {
//         if (answer !== "CLOUDFLARE" && answer !== "ERROR") {
//             try {
//                 let res = await answer.split("data:")
//                 try {
//                     const detail = JSON.parse(res[0]).detail
//                     document.getElementById('output').style.opacity = 1
//                     document.getElementById('output').innerHTML = detail
//                     return;
//                 } catch (e) {
//                     try {
//                         res = res[1].trim()
//                         if (res === "[DONE]") return
//                         answer = JSON.parse(res)
//                         let final = answer.message.content.parts[0]
//                         final = final.replace(/\n/g,'<br>')
//                         document.getElementById('output').style.opacity = 1
//                         document.getElementById('output').innerHTML = final
//                     } catch (e) {}
//                 }
//             } catch (e) {
//                 document.getElementById('output').style.opacity = 1
//                 document.getElementById('output').innerHTML = "Something went wrong. Please try in a few minutes."
//             }

//         } else if (answer === "CLOUDFLARE") {
//             document.getElementById('input').style.opacity = 1
//             document.getElementById('input').innerHTML = 'Log into <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a>, then try again. Redirecting...'
//             await sleep(3000)
//             chrome.tabs.create({url: "https://chat.openai.com/chat"})
//         } else {
//             document.getElementById('output').style.opacity = 1
//             document.getElementById('output').innerHTML = 'Something went wrong. Are you logged into <a target="_blank" href="https://chat.openai.com/chat">chat.openai.com</a>? Try logging out and logging in again.'
//         }
//     }

//     const getData = async (selection) => {
//         if (!selection.length == 0) {
//             document.getElementById('input').style.opacity = 1
//             document.getElementById('input').innerHTML = selection
//             document.getElementById('output').style.opacity = 0.5
//             document.getElementById('output').innerHTML = "Loading ..."
//             const port = chrome.runtime.connect();
//             port.postMessage({question: selection})
//             port.onMessage.addListener((msg) => showPopup(msg))
//         } else {
//             document.getElementById('input').style.opacity = 0.5
//             document.getElementById('input').innerHTML = "Please select some text from the webpage first."
//         }
//     }

//     const getSelectedText = async () => {
//         const activeTab = await getActiveTab()
//         chrome.tabs.sendMessage(activeTab.id, {type: "LOAD"}, getData)
//     }

//     getSelectedText()
// })
