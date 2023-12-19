//OUTPUT EDITOR LOGIC

function run(){
    
    let htmlCode = document.getElementById("html-code")
    let cssCode = document.getElementById("css-code")
    let jsCode = document.getElementById("js-code")
    let output = document.getElementById("output");

    output.contentDocument.body.innerHTML = htmlCode.value + "<style>" + cssCode.value + "</style>";

    output.contentWindow.eval(jsCode.value);
   executeCode();
    
}

//SAVE CHANGES 
document.getElementById('save-button').addEventListener('click', function() {
    // Get the HTML code from the textarea
    var htmlCode = document.getElementById('html-code').value;
    var cssCode = document.getElementById('css-code').value;
    var jsCode = document.getElementById('js-code').value;
    function downloadFile(content, fileName) {
        var blob = new Blob([content], { type: 'text/plain' });
        var file = new File([blob],{ type: 'text/plain' });
        var link = document.createElement('a');
        link.download = fileName;
        console.log(file.name);
        link.href = URL.createObjectURL(file);
        link.click();
      }
      try{
        downloadFile(htmlCode, 'index.html');
        downloadFile(cssCode, 'styles.css');
        downloadFile(jsCode, 'script.js');
      }
      catch(e){
        console.log(e);
      }
});

//LOAD CHANGES DROP DOWN (HTML,CSS AND JS)
function toggleDropdown() {
    var dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
  }


//FOR LOADING THE CHANGES LOGIC (I.E.., LOAD CHANGES BUTTON)

function openFile(param) {
    // Create an input element of type file
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
  
    // Set accept attribute to restrict file types to HTML
    fileInput.accept = `.${param}`;
  
    // Trigger a click on the input element
    fileInput.click();
  
    // Listen for the change event on the input element
    fileInput.addEventListener('change', function() {
      var selectedFile = fileInput.files[0];
     // alert(`Outer param value is ${param}`);
      if (selectedFile && (selectedFile.type === `text/${param}` || selectedFile.name.endsWith('.js'))) {
        alert(param);
        // Read the contents of the HTML file
        var reader = new FileReader();
        reader.onload = function(e) {
          // Assign the text content to a JavaScript variable
          var texter = e.target.result;
          if(param == 'html')
            document.getElementById('html-code').value = texter;
          else if(param == 'css')
            document.getElementById('css-code').value = texter;
          else if(param == 'js')
            document.getElementById('js-code').value = texter;
          else{
            console.log("please chose a valid file!!!");
          }
        };
        reader.readAsText(selectedFile);
      } else {
        alert(`Please select a valid ${param} file.`);
      }
    });
  }

//CONSOLE FOR THE JS EDITOR LOGIC 

var codeTextArea = document.getElementById('js-code');

// Get the console div element
var consoleDiv = document.getElementById('console');

// Create a function to capture console.log and console.error output
// Function to capture console.log and console.error output
function captureConsoleOutput() {
    var logs = [];
    var errors = [];
  
    var originalLog = console.log;
    console.log = function () {
      logs.push(Array.from(arguments).join(' '));
      originalLog.apply(console, arguments);
    };
  
    var originalError = console.error;
    console.error = function () {
      errors.push(Array.from(arguments).join(' '));
      originalError.apply(console, arguments);
    };
  
    return {
      getLogs: function () {
        return logs;
      },
      getErrors: function () {
        return errors;
      },
      clear: function () {
        logs = [];
        errors = [];
      }
    };
  }
  
  // Execute the JavaScript code and capture console output
  function executeCode() {
    // Clear previous console output
    consoleDiv.innerHTML = '';
  
    // Get the code from the text areas
    var javascriptCode = document.getElementById("js-code").value;
    var html5Code = document.getElementById("html-code").value;
  
    var consoleOutput = captureConsoleOutput();
  
    // Function to execute code and capture console output
    function executeAndCaptureCode(code) {
      try {
        // Use a Function constructor to create a function from the user's code
        var executedCode = new Function(code);
        executedCode();
  
        // Check if there's a specific function in the code
        if (typeof executedCode === 'function') {
          // If a function is found, execute it separately to capture its console output
          consoleOutput.clear(); // Clear previous console output
          executedCode(); // Execute the function
        }
      } catch (error) {
        consoleOutput.getErrors().push(error.message);
      }
    }
  
    // Execute and capture console output for JavaScript code
    executeAndCaptureCode(javascriptCode);
  
    // Display the console logs and errors in the console area
    consoleDiv.innerHTML = '<strong>Console Output:</strong><br>';
    consoleOutput.getLogs().forEach(function (log) {
      consoleDiv.innerHTML += '> ' + log + '<br>';
    });
    consoleOutput.getErrors().forEach(function (error) {
      consoleDiv.innerHTML += 'ERROR: ' + error + '<br>';
    });
  
    
  }
  
  // Add event listeners for input events on the text areas
  document.getElementById('js-code').addEventListener('input', executeCode);
  document.getElementById('html-code').addEventListener('input', executeCode);
  document.getElementById('outputClick').addEventListener('click', executeCode);
  
  // Initial execution of code when the page loads
  executeCode();
  

  //HTML Validation 

  function validateHTML() {
    // Get the HTML code from the textarea
    var htmlCode = document.getElementById('html-code').value;
    //console.log("Html Code Type:"+typeof htmlCode);
    // Create a new DOMParser
    var parser = new DOMParser();
    //console.log("html Code:"+ htmlCode);
    // Parse the HTML code
    var doc = parser.parseFromString(htmlCode, 'text/html');
    //console.log("validate Html"+doc)
   // console.log("Document: "+doc.parseErrors);
    // Check for parsing errors
    if (!doc.body || doc.body.childElementCount === 0) {
        console.error('HTML Syntax Error: Invalid HTML');
    } else {
        console.log('HTML is valid!');
    }
}

// Attach the validation function to an event, for example, when a button is clicked
document.getElementById('validate-button').addEventListener('click', validateHTML);


//sample html code type
function validateHTML(htmlString) {
    var parser = new DOMParser();
    var doc;

    try {
        doc = parser.parseFromString(htmlString, 'text/html');
        var errors = doc.parseErrors;

        if (errors && errors.length > 0) {
            console.error('HTML Syntax Error(s):');

            errors.forEach(function (error) {
                console.error(`Code: ${error.code}, Message: ${error.message}, Line: ${error.lineNumber}`);
            });

            return false; // Invalid HTML
        }
    } catch (e) {
        console.error('Error during parsing:', e.message);
        return false; // Invalid HTML
    }

    console.log('HTML is valid!');
    return true; // Valid HTML
}

// Example usage:
var htmlString = document.getElementById('html-code').value;
validateHTML(htmlString);