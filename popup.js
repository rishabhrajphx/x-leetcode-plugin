document.addEventListener('DOMContentLoaded', function() {
    // Load saved URL
    chrome.storage.sync.get(['redirectURL'], function(result) {
        if (result.redirectURL) {
            document.getElementById('redirectUrl').value = result.redirectURL;
        }
    });

    // Save button click handler
    document.getElementById('saveButton').addEventListener('click', function() {
        const newUrl = document.getElementById('redirectUrl').value;
        
        // Basic URL validation
        try {
            new URL(newUrl);
            // Save to chrome.storage
            chrome.storage.sync.set({
                redirectURL: newUrl
            }, function() {
                // Visual feedback
                const button = document.getElementById('saveButton');
                button.textContent = 'Saved!';
                setTimeout(() => {
                    button.textContent = 'Save Settings';
                }, 2000);
            });
        } catch (e) {
            alert('Please enter a valid URL');
        }
    });
}); 