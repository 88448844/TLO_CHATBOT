# TLO Chatbot

## Overview

The TLO Chatbot is an interactive web application developed for TLO, designed to provide users with detailed, fact-based responses in a conversational format. It seamlessly integrates front-end technologies—HTML, CSS, and JavaScript—with a Python backend that leverages the Google Gemini API.

## Features

- **Interactive Chat Interface:** Offers a clean and user-friendly design that facilitates seamless conversations.
- **Responsive Communication:** Provides detailed, fact-based responses to user inquiries.
- **Loading Indicator:** Utilizes a visual cue to inform users when the chatbot is processing a response from the Gemini API.
- **Extended Functionality:** Supports file uploads and voice recording, with ongoing enhancements to fully implement these features.
- **Enhanced Code Display:** Features code block styling accompanied by a copy-to-clipboard functionality for user convenience.

## Technologies Used

- **Front-End:** HTML, CSS, JavaScript
- **Back-End:** Python
- **API Integration:** Google Gemini API (make sure to rename .env.example to .env and set it with you google api)
  

## Installation Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/88448844/TLO_CHATBOT.git
   ```


2. **Set Up Python Environment:**

   - Navigate to the repository directory:
     ```bash
     cd TLO_CHATBOT
     ```

   - (make sure to rename .env.example to .env and set it with you google api)
     
   - create a folder named knowledge_base and upload docx files in order to create a custom defualt knowledge base
     
   - Create a virtual environment:
     ```bash
     python -m venv venv
     ```
     
   - Activate the virtual environment:
     - On **Windows:**
       ```bash
       .\venv\Scripts\activate
       ```
     - On **macOS/Linux:**
       ```bash
       source venv/bin/activate
       ```
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
     
    
4. **Prepare Front-End Assets:**
   - Ensure that the `TLO_welcome.png` image file is located in the same directory as `index.html`.

## Usage

1. **Start the Python Backend:**
   - Activate the virtual environment (if not already active).
   - Run the Python server:
     ```bash
     python server.py
     ```
2. **Open the Chatbot Interface:**
   - Open `index.html` in your web browser.
3. **Interact with the Chatbot:**
   - Upon loading, the welcome image appears.
   - Enter your message in the input field and click the send button (paper plane icon).
   - The welcome image will disappear, and the conversation will commence.
   - The chatbot's responses will follow, with a loading indicator displayed during processing.

## Customization

- **Welcome Image:** To change the welcome image, replace `TLO_welcome.png` with your preferred image, ensuring it has the same filename and resides in the correct directory. Adjust its size by modifying the CSS rules for `#welcome-screen` and `#welcome-image` in the `<style>` section of `index.html`.
- **Styling:** Customize the chatbot's appearance by editing the CSS variables and styles within the `<style>` section of `index.html`.
- **Functionality:** Modify the chatbot's behavior by altering the core logic found in the `<script>` section of `index.html` and the `server.py` file.

## Credits

Developed for TLO by Gabriel Bengo. 2025

## License

This project is licensed under the MIT License:



```
MIT License

Copyright (c) 2025 Gabriel Bengo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


