function hamburgerNav(){
    const hamburger_Button = document.getElementById("hamburger-button")
    const hamburger_Navigation = document.getElementById("hamburger-navigation")
    hamburger_Button.addEventListener("click", ()=>{
        // console.log(hamburger_Navigation.classList.value.includes("hidden"))
        hamburger_Navigation.classList.value.includes("hidden")? hamburger_Navigation.classList.remove("hidden"):hamburger_Navigation.classList.add("hidden")
    })
} 
hamburgerNav()
let lastRequest = new Date() - 1000
const API_URL = "https://api.shrtco.de/v2/shorten?url="
const API_Error_Codes = {
    1:	"No URL specified ('url' parameter is empty)",
    2:	"Invalid URL submitted",
    3:	"Rate limit reached. Wait a second and try again",
    4:	"IP-Address has been blocked because of violating our terms of service",
    5:	"Shortcode code (slug) already taken/in use",
    6:	"Unknown error",
    7:	"No code specified ('code' parameter is empty)",
    8:	"Invalid code submitted (code not found/there is no such short-link)",
    9:	"Missing required parameters",
    10:	"Trying to shorten a disallowed Link. More information on disallowed links"
}
function makeLabel(labelFor, labelText) {
    const label = document.querySelector(`label[for=${labelFor}]`)
    label.innerText = labelText
    const text_input = document.querySelector(`.shorten-app form input[type="text"]`)
    text_input.classList.add("wrong-input")
}
function removeLabel(labelFor) {
    const label = document.querySelector(`label[for=${labelFor}]`)
    label.innerText = ""
    const text_input = document.querySelector(`.shorten-app form input[type="text"]`)
    text_input.classList.remove("wrong-input")
}

const callAPI = async(url_input) => {
    const apireply = await fetch(API_URL+url_input)
    const data = await apireply.json()
    // data.map(country => createCountry(country))
    if(data.error){
        makeLabel("url_input", API_Error_Codes[data.error_code])
    } else {
        createLink(url_input, data.result.short_link)
        removeLabel("url_input")
        clearInputForm()
    }
 }   
function shortenLink() {
    const submitButton = document.getElementById("url_shorten_submit")
    const submitInput = document.getElementById("url_input")
    submitButton.addEventListener("click", ()=>{
        const now = new Date()
        if(now-lastRequest > 1000){
            if(submitInput.value === ""){
                makeLabel("url_input", API_Error_Codes[1])
            } else {
               callAPI(submitInput.value)
                lastRequest = now 
            }
        } else {
            makeLabel("url_input", API_Error_Codes[3])
        }
    })
}
shortenLink()
function clearInputForm(){
    const submitInput = document.getElementById("url_input")
    submitInput.value = ""
}


function createLink(fullLink, shortLink) {
    const resultDiv = document.querySelector(".results")
    const newResult = document.createElement("div")
    newResult.classList.add("result")
    const fullLinkDiv = document.createElement("div")
    fullLinkDiv.classList.add("full-link")
    fullLinkDiv.innerText = fullLink
    const shortLinkDiv = document.createElement("div")
    shortLinkDiv.classList.add("result-link")
    shortLinkDiv.innerText = shortLink
    const copyButton = document.createElement("button")
    copyButton.classList.add("copy")
    copyButton.innerText = "Copy"
    copyButton.addEventListener("click", ()=>{
        copyShortLink(copyButton)
    })
    newResult.append(fullLinkDiv, shortLinkDiv, copyButton)
    resultDiv.append(newResult)
}
function copyShortLink(button){
    const linkToCopy = button.parentNode.querySelector(".result-link").innerText
    navigator.clipboard.writeText(linkToCopy)
    button.classList.remove("copy")
    button.classList.add("copied")
    button.innerText = "Copied!"
}
const observers = function() {
    const advert_link = document.querySelector(".advert-link")
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting && entry.target.className === "advert-link"){
                entry.target.classList.add('advert-animation');
            }
            
        })
    })
    observer.observe(advert_link)
}
observers()