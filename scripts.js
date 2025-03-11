// filepath: c:\Users\User\Desktop\TLO_CHATBOT\script.js
const messagesContainer = document.getElementById('messages');
const userInput         = document.getElementById('userInput');
const fileInput         = document.getElementById('fileInput');
const voiceButton       = document.getElementById('voiceButton');
const recordingIndicator= document.querySelector('.recording-indicator');
const attachmentButton  = document.getElementById('attachmentButton');
const attachmentPanel   = document.getElementById('attachmentPanel');
const typingIndicator   = document.getElementById('typingIndicator');
const loadingIndicator  = document.getElementById('loadingIndicator');
let recognition;
let conversationHistory = [];
let currentConversation = { id: null, messages: [] };
// Toggle the attachment panel
attachmentButton.addEventListener('click', () => {
  attachmentPanel.style.display = attachmentPanel.style.display === 'none' ? 'block' : 'none';
});
// Voice Recognition
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value   = transcript;
    console.log('speech:', transcript);
  };
  recognition.onstart = () => { recordingIndicator.style.display = 'block'; };
  recognition.onend   = () => { recordingIndicator.style.display   = 'none'; };
}
// Helper: Extract <html> block
function extractHTML(text) {
  const regex = /<html[\s\S]*<\/html>/i;
  const match = text.match(regex);
  return match ? match[0] : null;
}
function createMessageElement(text, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', isUser ? 'user-message' : 'assistant-message');
  let processedText = text;
  // Transform triple-backtick code blocks
  processedText = processedText.replace(/```(\w+)\n([\s\S]*?)```/g, (match, language, code) => {
    const codeTrimmed = code.trim();
    if (language === 'html') {
      const htmlContent = extractHTML(codeTrimmed);
      return `
        <div class="code-container">
          <div class="html-render-container">
            <button class="copy-html-btn" onclick="copyHtmlCode(this, '${encodeURIComponent(htmlContent)}')">
              Copy HTML
            </button>
            <div class="html-iframe-wrapper">
              <iframe
                sandbox="allow-scripts"
                srcdoc="${encodeURIComponent(htmlContent)}"
                style="width:100%;height:300px;border:none;"
              ></iframe>
            </div>
          </div>
        </div>
      `;
    } else if (language === 'pyscript') {
      return `
        <div class="code-container">
          <div class="html-render-container">
            <div class="html-iframe-wrapper">
              <py-script>
                ${codeTrimmed}
              </py-script>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="code-container">
          <pre><code class="language-${language}">${codeTrimmed}</code></pre>
          <div class="code-toolbar">
            <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          </div>
        </div>
      `;
    }
  });
  messageDiv.innerHTML = `
    <div class="message-header">
      <div class="message-icon">
        ${isUser ? '<i class="fas fa-user"></i>' : '<img src="TLO.png" alt="TLO ChatBot" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;">'}
      </div>
      <div>${isUser ? 'You' : 'TLO ChatBot'}</div>
    </div>
    ${processedText}
  `;
  // Re-run Prism highlight
  setTimeout(() => Prism.highlightAllUnder(messageDiv), 10);
  return messageDiv;
}
// Add message to UI
function addMessage(text, isUser) {
  const msgElement = createMessageElement(formatLLMResponse(text), isUser);
  messagesContainer.appendChild(msgElement);
  // Scroll to the bottom of the messages container
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  currentConversation.messages.push({ text, isUser, timestamp });
}
async function getGeminiResponse(prompt, conversationId) {
  try {
    const file = fileInput.files[0];
    let fileData = '';
    if (file) {
      fileData = await readFileAsBase64(file);
      fileInput.value = '';
      console.log('fileData', fileData);
    }
    // Adjust to your local server or deployment
    const response = await fetch('http://127.0.0.1:5000/run', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        task              : prompt,
        add_infos         : "",
        agent_type        : "custom",
        llm_provider      : "gemini",
        llm_model_name    : "gemini-1.5-flash",
        llm_temperature   : 1,
        llm_base_url      : null,
        llm_api_key       : "AIzaSyAn4pR_NsfKdxi4q7cGBH2tJAwDopsY_Wk",
        use_own_browser   : true,
        headless          : false,
        disable_security  : true,
        window_w          : 1200,
        window_h          : 800,
        save_recording_path : "./tmp/record_videos",
        save_trace_path     : "./tmp/traces",
        enable_recording    : true,
        max_steps           : 100,
        use_vision          : true,
        max_actions_per_step: 10,
        tool_call_in_content: true,
        conversationId      : conversationId,
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('API Error:', error);
    return { final_result: "Sorry, I encountered an error. Please try again." };
  }
}
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function copyCode(button) {
  const code = button.closest('.code-container').querySelector('code').innerText;
  navigator.clipboard.writeText(code);
  button.textContent = 'Copied!';
  setTimeout(() => (button.textContent = 'Copy'), 2000);
}
function copyHtmlCode(button, htmlCode) {
  const decodedHtml = decodeURIComponent(htmlCode);
  navigator.clipboard.writeText(decodedHtml);
  button.textContent = 'Copied!';
  setTimeout(() => (button.textContent = 'Copy HTML'), 2000);
}
// Handle file selection
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    addMessage(`File attached: ${file.name}`, true);
  }
});
// Voice Recording
voiceButton.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  }
});
// The actual "Send" function
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, true);
  userInput.value = '';
  loadingIndicator.style.display = 'flex';
  try {
    const data = await getGeminiResponse(message, currentConversation.id);
    if (data.need_more_info) {
      addMessage("I need more information.", false);
    } else {
      addMessage(data.final_result || "", false);
    }
    // OPTIONAL: If you want to see the model actions/thoughts in chat:
    if (data.model_actions && data.model_actions.length > 0) {
      const actionsStr = data.model_actions.join('\n');
      addMessage(`**Model Actions**:\n\`\`\`\n${actionsStr}\n\`\`\``, false);
    }
    if (data.model_thoughts && data.model_thoughts.length > 0) {
      const thoughtsStr = data.model_thoughts.join('\n');
      addMessage(`**Model Thoughts**:\n\`\`\`\n${thoughtsStr}\n\`\`\``, false);
    }
  }
  catch (error) {
    addMessage("Error processing your request", false);
  }
  loadingIndicator.style.display = 'none';
}
function formatLLMResponse(text) {
  let formatted = text.replace(/\n/g, '<br>');
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formatted = formatted.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  formatted = formatted.replace(/^## (.*)$/gm, '<h2>$2</h2>');
  formatted = formatted.replace(/^### (.*)$/gm, '<h3>$3</h3>');
  formatted = formatted.replace(/^\*\s+(.*)$/gm, '<li>$1</li>').replace(/(<li>.*?<\/li>(<br>)?)+/g, '<ul>$&</ul>');
  formatted = formatted.replace(/^(\d+)\.\s+(.*)$/gm, '<li>$2</li>').replace(/(<li>.*?<\/li>(<br>)?)+/g, '<ol>$&</ol>');
  return formatted;
}