const inputTextarea = document.getElementById('input');
const outputTextarea = document.getElementById('output');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const status = document.getElementById('status');

function showStatus(message, type) {
    status.className = `status ${type}`;
    status.innerHTML = type === 'loading' 
        ? `<span class="loading-spinner"></span>${message}` 
        : message;
    status.style.display = 'block';
    
    if (type === 'error') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    } else if (type === 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

function hideStatus() {
    status.style.display = 'none';
}

function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

async function convertJSON() {
    const inputValue = inputTextarea.value.trim();
    
    if (!inputValue) {
        showStatus('Please enter some JSON to convert', 'error');
        return;
    }

    if (!isValidJSON(inputValue)) {
        showStatus('Please enter valid JSON format', 'error');
        return;
    }

    convertBtn.disabled = true;
    showStatus('Converting JSON...', 'loading');

    try {
        const response = await fetch('http://localhost:3000/json_keys/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: inputValue
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const convertedJSON = await response.text();
        
        console.log('Received response:', convertedJSON); // Debug log
        
        // Try to format the JSON for better display
        try {
            const parsed = JSON.parse(convertedJSON);
            outputTextarea.value = JSON.stringify(parsed, null, 2);
        } catch (e) {
            // If it's not valid JSON, just display as is
            outputTextarea.value = convertedJSON;
        }

        // Ensure the textarea keeps its value
        setTimeout(() => {
            if (!outputTextarea.value) {
                outputTextarea.value = convertedJSON;
            }
        }, 100);

        showStatus('✅ JSON converted successfully!', 'success');
        
    } catch (error) {
        console.error('Error converting JSON:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showStatus('❌ Cannot connect to localhost:3000. Make sure your server is running.', 'error');
        } else {
            showStatus(`❌ Error: ${error.message}`, 'error');
        }
        
        outputTextarea.value = '';
    } finally {
        convertBtn.disabled = false;
    }
}

function clearFields() {
    inputTextarea.value = '';
    outputTextarea.value = '';
    hideStatus();
}

async function copyToClipboard() {
    const outputValue = outputTextarea.value;
    
    if (!outputValue) {
        showStatus('Nothing to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(outputValue);
        showStatus('📋 Copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        outputTextarea.select();
        document.execCommand('copy');
        showStatus('📋 Copied to clipboard!', 'success');
    }
}

// Event listeners
convertBtn.addEventListener('click', convertJSON);
clearBtn.addEventListener('click', clearFields);
copyBtn.addEventListener('click', copyToClipboard);

// Allow Enter key to trigger conversion (Ctrl+Enter or Cmd+Enter)
inputTextarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        convertJSON();
    }
});

// Auto-hide status when user starts typing (but not for success messages)
inputTextarea.addEventListener('input', () => {
    if (status.style.display === 'block' && 
        !status.classList.contains('loading') && 
        !status.classList.contains('success')) {
        hideStatus();
    }
});