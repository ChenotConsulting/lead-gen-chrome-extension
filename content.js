
var openAIApiKey = ''

function loadCss() {
    // Add CSS styles for the modal
    var style = document.createElement('style');
    style.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: #fafaff;
        color: #393e46;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 500px;
        border-radius: 8px;
        font-family: Roboto, Helvetica;
    }

    .loading {
        text-align: center;
        text-decoration: none;
        font-size: 16px;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    .btn {
        background-color: #8dbf8e;
        color: #f2ede3;
        border: none;
        padding: 10px 20px;
        margin: 10px 0px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
    }  
    
    .btn:hover {
        background-color: #3e829a;
    }
    
    .message {
        margin: 0 0 0 10px;
    }
    `

    // Append the style element to the document head
    document.head.appendChild(style)
}

function updateModalContent(message) {
    var contentElement = document.getElementById('content')
    contentElement.innerHTML = message
}

function getLinkedInMessage(name, title, about){
    console.log('Calling OpenAI')
    const prompt = 'At ProfessionalPulse, we\'re passionate about leveraging technology to transform the operations of Business Services teams within Professional Services Firms. Our journey began in the dynamic realm of IT and ' +
                    'consultancy, and was inspired by real-life challenges faced by these teams. Today, we use our expertise and unique approach to help these teams navigate their challenges, boost efficiency, and strike a balance ' +
                    'between their professional and personal lives. Discover more about our ethos, our journey, and how we can help you. \n' +
                    'You are tasked with writing a LinkedIn message based on this profile: \n' + 
                    'Name: ' + name.textContent + '\n' + 
                    'Title: ' + title.textContent + '\n' + 
                    'About: ' + about.textContent + '\n' + 
                    'The message must be personalised using their first name, it must be short, written in UK English and sound professional (but using simple language) as the target audience are professionals, and finish with a call to action to ' +
                    'book a free 30 minutes audit consultation via the following link: https://tinyurl.com/4f79etr4. Add something around that even if they are not interested in a professional collaboration, ' +
                    'I\'d love to speak to them as a subject matter expert in legal operations. \n' +
                    'Sign with Jean-Philippe Chenot \n' + 
                    'Here is an example of personalisation: \n' +
                    'Your impressive tenure as the COO at rradar, especially your expertise in Legal Technology and Process Improvement, resonates with the core ethos of our consultancy. ' + 
                    'It\'s evident that we share a common goal - refining operational workflows to unlock a higher degree of efficiency. \n' + 
                    'Do not add a subject, and do not add my title in the signature. Only use my name.'
    
    // Make an API call
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const requestData = {
        model: "gpt-4",
        temperature: 0.3,
        n: 1,
        messages: [
            {
              role: "system",
              content: "You are a sales manager for a consultancy called ProfessionalPulse."
            },
            {
              role: "user",
              content: prompt
            }
        ]
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIApiKey}`
        },
            body: JSON.stringify(requestData)
        }
    )
    .then(response => response.json())
    .then(data => {
        message = data['choices'][0]['message']['content']
        console.log(message)
        updateModalContent(message)
    })
    .catch(error => {
        console.error('Error:', error);
    })
} 

function startMessageProcess(modal, modalContent, name, title, about){
    // Create the modal elements dynamically    
    var content = document.createElement('p')
    content.innerHTML = 'Generating message. Please wait a few seconds...';
    content.id = 'content'

    var copyBtn = document.createElement('button')
    copyBtn.textContent = 'Copy'
    copyBtn.className = 'btn'
    copyBtn.addEventListener('click', function() {
        const contentElement = document.getElementById('content')

        navigator.clipboard.writeText(contentElement.innerHTML)
        .then(function() {
            console.log('Content copied to clipboard!')
        })
        .catch(function(error) {
            console.error('Failed to copy content: ', error)
        })
    })

    var msgBtn = document.createElement('button')
    msgBtn.textContent = 'Message'
    msgBtn.className = 'btn message'
    msgBtn.addEventListener('click', function() {
        const messageButton = document.evaluate("//button[contains(@aria-label, 'Message')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().click()

        // setTimeout(function() {
            // UNTIL I CAN FIGURE OUT A WAY TO PROPERLY FORMAT THE TEXT I WILL SKIP THIS
            // var message = document.getElementById('content').innerHTML
            // var messageInput = document.evaluate("//div[contains(@class, '__contenteditable')]//p", document, null, XPathResult.ANY_TYPE, null).iterateNext()
            // messageInput.textContent = message
            // modal.style.display = 'none'
        // }, 1000)
        
        modal.style.display = 'none'
    })

    // Append the elements to build the modal
    modalContent.appendChild(content)
    modalContent.appendChild(copyBtn)
    modalContent.appendChild(msgBtn)

    const message = getLinkedInMessage(name, title, about)
}

function openModal(name, title, about) {
    // Create the modal elements dynamically
    var modal = document.createElement('div')
    modal.className = 'modal'

    var modalContent = document.createElement('div')
    modalContent.className = 'modal-content'

    var closeBtn = document.createElement('span')
    closeBtn.className = 'close'
    closeBtn.innerHTML = '&times;'
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none'
    })

    var startBtn = document.createElement('button')
    startBtn.textContent = 'Generate Message'
    startBtn.className = 'btn'
    startBtn.addEventListener('click', function() {
        modalContent.removeChild(startBtn)
        startMessageProcess(modal, modalContent, name, title, about)
    })

    // Append the elements to build the modal
    modalContent.appendChild(closeBtn)
    modalContent.appendChild(startBtn)
    modal.appendChild(modalContent)
    document.body.appendChild(modal)
    loadCss()

    // Open the modal
    modal.style.display = 'block'
} 

window.onload = function(event) {
    // Use XPath to extract information from the page
    const nameExpression = "//h1[contains(@class, 'text-heading-xlarge inline t-24 v-align-middle break-words')]"
    const nameData = document.evaluate(nameExpression, document, null, XPathResult.ANY_TYPE, null)
    const name = nameData.iterateNext()

    const titleExpression = "//div[contains(@class, 'text-body-medium break-words')]"
    const titleData = document.evaluate(titleExpression, document, null, XPathResult.ANY_TYPE, null)
    const title = titleData.iterateNext()

    const aboutExpression = "//section[starts-with(@id, 'ember')]//div//div//div//div//h2//span[contains(text(), 'About')]//ancestor::section[starts-with(@id, 'ember')]//div[3]//div//div//div//span[1]"
    const aboutData = document.evaluate(aboutExpression, document, null, XPathResult.ANY_TYPE, null)
    const about = aboutData.iterateNext() != null ? aboutData.iterateNext() : ''

    // Get the URL of the config file
    const configUrl = chrome.runtime.getURL('config/config.json');

    // Fetch the content of the config file
    fetch(configUrl)
    .then(response => response.text())
    .then(configContent => {
        // Parse the content of the config file
        const config = JSON.parse(configContent);

        // Access the desired variable from the config file
        openAIApiKey = config.openAIApiKey;

        openModal(name, title, about)
    })
    .catch(error => {
        console.error('Error fetching config file:', error);
    });
}