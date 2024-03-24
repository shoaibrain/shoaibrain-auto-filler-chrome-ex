// extension effect
let active = false;


function checkForFormPresence() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      if (chrome.runtime.lastError) {
        console.error("Error querying active tab:", chrome.runtime.lastError);
        return;
      }
      const activeTab = tabs[0];
      if (!activeTab) {
        console.error("No active tab found.");
        return;
      }
      // Inject a script to check for form presence
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id ? activeTab.id : -1 },
        func: () => {
          const form = document.querySelector("form");
          if (form) {
            console.log("Form present on this page.");
          } else {
            console.log("Form not present on this page.");
          }
        },
      });
    });
  }
  
chrome.action.onClicked.addListener(async () => {
    checkForFormPresence();
});
