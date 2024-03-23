// Function to extract data from a form field
function getFormFieldData(field) {
  return {
    id: field.id,
    label: field.getAttribute("label"),
    type: field.type,
    value: field.value
  };
}

// Function to extract data from all form elements
function extractFormFields() {
  const form = document.querySelector("form");
  if (form) {
    const fields = form.querySelectorAll("input, select, textarea");
    const formFields = Array.from(fields).map(getFormFieldData); 
    console.log("Form Fields:", formFields);
    return formFields;
  } else {
    console.log("No form detected in the current tab.");
    return null; // Return null if no form is detected
  }
}

// Event listener for when the extension button is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Get the active tab
  let activeTab = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTab = activeTab[0];
  
  // Access the DOM of the active tab and inject both extractFormFields and getFormFieldData functions
  chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    function: () => {
      window.getFormFieldData = function (field) {
        return {
          id: field.id,
          label: field.getAttribute("label"),
          type: field.type,
          value: field.value
        };
      };
      window.extractFormFields = function () {
        const form = document.querySelector("form");
        if (form) {
          const fields = form.querySelectorAll("input, select, textarea");
          const formFields = Array.from(fields).map(window.getFormFieldData);
          console.log("Form Fields:", formFields);
          return formFields;
        } else {
          console.log("No form detected in the current tab.");
          return null;
        }
      };
      return extractFormFields();
    }
  }, (extractedData) => {
    if (chrome.runtime.lastError) {
      console.error("Error extracting form data:", chrome.runtime.lastError);
      return;
    }
    const formFields = extractedData[0]; // Since only one function is injected
    if (!formFields) {
      // Show a popup if no form is detected
      chrome.windows.create({
        type: 'popup',
        url: 'popup.html',
        width: 300,
        height: 200
      });
    }
  });
});