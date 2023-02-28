/***********
 * CONSTANTS
 ***********/

import hljs from "highlight.js";
import "./dracula.css";

const CODE_BLOCK_IDENTIFIER = "```";
const INLINE_CODE_IDENTIFIER = "`";
const port = chrome.runtime.connect({ name: "main-port" });

/**************
 * DOM PAYLOADS
 **************/

const scrapeQuestion = () => {
  const inputText = document.getElementById("chatgpt-input").value;

  port.postMessage({
    key: "SCRAPED_QUESTION",
    value: {
      questionText: inputText
    }
  });

  console.log("Sent: SCRAPED_QUESTION", inputText);

}

const insertAnswer = chatGPTOutput => {
  const isError = false;
  const { text } = chatGPTOutput;

  console.log(text);

  const chatgptResponseElem = document.getElementById("chatgpt-response");
  chatgptResponseElem.innerText = text;
}

const insertError = errorMessage => {
  const isError = true;

  insertElement("chatGPTError", () => createAnswerElement(isError));
  populateNonAnswerText(isError, errorMessage);
}

/*****************
 * EVENT LISTENERS
 *****************/

port.onMessage.addListener(message => {
  const { key, value } = message;

  console.log(`Received: ${key}`);

  if (key === "CHATGPT_OUTPUT") {
    insertAnswer(value);
  } else if (key === "ERROR") {
    insertError(value);
  }
});

function handleSubmit() {
    // alert("Chal gaya!!");
    scrapeQuestion();
}

function addInputForm() {
   const html = `
      <input id="chatgpt-input" type="text"></input>
  `
  const button = document.createElement("button");
  button.innerText = "Submit";
  button.addEventListener("click", handleSubmit);

   const elem = document.createElement("div");
   elem.id =  "chatGPTAnswer";
   elem.innerHTML = html;
   elem.appendChild(button);

   const answer = document.createElement("p");
   answer.id = "chatgpt-response";
   elem.appendChild(answer);

   return elem;
}

window.onload = () => {
  const isError = false;
  const g = document.querySelector("[data-target='readme-toc.content']");
  g.parentElement.insertBefore(addInputForm(), g);
}
