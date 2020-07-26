/*
        File: Custom_JavaScript_Function.js
     Created: 07/26/2020
     Updated: 07/26/2020
  Programmer: Cuates
  Updated By: Cuates
     Purpose: jQuery functions for user experience
*/

// Make the following functions ready for use
$(document).ready(function()
{
  // Function to call upload
  hideUploadClearButtons();
  clearInputField();
  inputBrowseChange();

  // Upload data and deliver file
  uploadHideButtonDataDeliver();

  // Search Data
  searchDataAction();

  // Insert, Update, or Delete Data Action
  iudDataAction();

  // Extract Data Information
  extractDataInformation();
});

//---- Begin Custom jQuery UI Dialog ----//
/* Display dialog box with loader */
function DialogBox(title)
{
  // Initialize parameter
  var url = "";

  // Create an instance of dialog
  var myDialog = $("#dialog").dialog(
  {
    autoOpen: false,
    modal: true,
    title: title,
    show: 'fade',
    hide: 'drop',
    resizable: false,
    draggable: false,
    closeOnEscape: false,
    open: function()
    {
      // Hide the close button in the dialog window
      $("#dialog").dialog().parent('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
    },
    close: function()
    {
      // Clear out text from dialog
      $("#dialog-text").html("");

      // Destroy currently opened dialog
      $(this).dialog('destroy');
    }
  });

  // Check if dialog has not been open yet
  if(myDialog.dialog("isOpen") !== true)
  {
    // If not open the dialog box
    $("#dialog").dialog("open");
  }

  // Retrieve the current domain name server
  var url = window.location.protocol + '//' + window.location.host + '/';

  // Place text inside the body of the div in the dialog
  $("#dialog-text").html('<center><img src="' + url + 'path/ajax-loader.gif" id="cloader" alt="loading..." /><br />' + title + '...<center>').css('color', '#000000');
}

/* Display dialog box with custom title and body message */
function DialogMsg(retnStatus, titlemesg, bodymesg)
{
  // Create an instance of dialog
  var myDialog = $("#dialog").dialog(
  {
    autoOpen: false,
    modal: true,
    title: titlemesg,
    show: 'fade',
    hide: 'drop',
    resizable: false,
    draggable: false,
    closeOnEscape: false,
    buttons : {
      "Okay" : function()
      {
        // Close the dialog
        $(this).dialog("close");
      }
    },
    open: function()
    {
      // Hide the close button in the dialog window
      $("#dialog").dialog().parent('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
    },
    close: function()
    {
      // Clear out text from dialog
      $("#dialog-text").html("");

      // Destroy currently opened dialog
      $(this).dialog('destroy');
    }
  });

  // Check if dialog has not been open yet
  if(myDialog.dialog("isOpen") !== true)
  {
    // If not open the dialog box
    $("#dialog").dialog("open");
  }

  // Check if return status is success
  if ($.trim(retnStatus) === "Success")
  {
    // Place text inside the body of the div in the dialog
    $("#dialog-text").html(bodymesg).css('color', '#000000');
  }
  else
  {
    // Place text inside the body of the div in the dialog
    $("#dialog-text").html(bodymesg).css('color', '#FF0000');
  }
}
//---- End Custom jQuery UI Dialog ----//

// Upload file containing data for processing
// Check if browse section is not empty
function inputBrowseChange()
{
  // On change take action
  $('.myFile').on('change', function()
  {
    // Check if the value of the current input field is not empty
    if($(this).val() !== "")
    {
      // Show the upload button
      $('#clearBtn').show();

      // Show the upload button
      $('#uploadBtn').show();
    }
  });
}

// Hide upload and clear buttons initially
function hideUploadClearButtons()
{
  // Hide the upload button
    $('#clearBtn').hide();

    // Hide the upload button
    $('#uploadBtn').hide();
}

// Clear entry of the browse input field
function clearInputField()
{
  // On click take action
  $('.clearBtn').on('click', function()
  {
    // Clear out the input field
    $('#myFile').val('');

    // Hide the upload button
    $('#clearBtn').hide();

    // Hide the upload button
    $('#uploadBtn').hide();

    // Clear message presented to end user
    $('#UserMessage').html('').css('color', '#000000');
  });
}

// Upload data and deliver file
function uploadHideButtonDataDeliver()
{
  // On submit on form take action
  $('.fileUploadDataInformationSFTP').submit(function(event)
  {
    // Prevent the default action from taking place
    event.preventDefault();

    // Disable buttons on submit
    $('#clearBtn').attr("disabled", "disabled");
    $('#uploadBtn').attr("disabled", "disabled");

    // Display error message to the end user
    $('#UserMessage').html('').css('color', '#000000');

    // Display the ajax loading process image
    DialogBox("Processing...");

    // Retrieve value from the client-side page
    var fileValue = $('#myFile').val();

    // Retrieve the current domain name server
    var url = window.location.protocol + '//' + window.location.host + '/';

    // Check if values are  not empty
    if(fileValue === "")
    {
      // Display error message to the end user
      DialogMsg('Error', 'Upload Halted', '<center>Upload halted because there was an issue with the file</center>');

      // Enable buttons for submit
      $('#clearBtn').removeAttr("disabled");
      $('#uploadBtn').removeAttr("disabled");
    }
    else
    {
      // Display the ajax loading process image
      DialogBox("Sending File...");

      // Store file into variable
      data = new FormData($('#fileUploadDataInformationSFTP')[0]);

      // Side note: if adding async:false would cause the ajax loader gif to not function properly
      // Send ajax variables to server-side
      $.ajax({
        type: "POST",
        url: url + "path/uploadDataSFTP.php",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(data)
        {
          // Alert to the user that values are the same or there are empty inputs
          DialogMsg(data.SRes, 'Request Processed', data.SMesg);

          // Check if successfully executed
          if(data.SRes === "Success")
          {
            // Empty the input filed for another file to be uploaded
            $('#myFile').val('');

            // Hide the upload button
            $('#clearBtn').hide();

            // Hide the upload button
            $('#uploadBtn').hide();
          }

          // Enable buttons for submit
          $('#clearBtn').removeAttr("disabled");
          $('#uploadBtn').removeAttr("disabled");

          // stop the ajax from processing anything else
          return false;
        },
        error: function(data)
        {
          // Enable buttons for submit
          $('#clearBtn').removeAttr("disabled");
          $('#uploadBtn').removeAttr("disabled");

          // Display error message
          DialogMsg('Error', 'Upload Halted', '<center>There was an error when communicating to the server-side</center>');

          // stop the ajax from processing anything else
          return false;
        }
      });
    }
  });
}

// Search Data
function searchDataAction()
{
  // On enter key take action
  $("#dataInputText").keypress(function(event)
  {
    // Obtain the key code
    var keycode = (event.keyCode ? event.keyCode : event.which);

    // If enter key is pressed
    if(keycode == 13 || keycode == 5)
    {
      // Take action
      searchData();
    }

    // Stop multiple executions of a given function due to event propagation
    event.stopPropagation();
  });

  // On click take action
  $(document).on('click', "#searchDataBtn", searchData);

  // Search Domain Name
  function searchData()
  {
    // Disable buttons on click
    $('#searchDataBtn').attr("disabled", "disabled");

    // Set text color
    $('#MessageResponse').html('').css('color', '#000000');

    // Display the ajax loading process image
    DialogBox("Searching Data");

    // Retrieve values and set regular expression
    var param01val = $('#dataInputText').val();
    var psregex = /^[a-zA-Z0-9\-]{1,}$/;

    // Check if value is given and follows the regular expression
    if(!param01val || !psregex.test(param01val))
    {
      // Alert to the user that values are the same or there are empty inputs
      DialogMsg("Error", "Search Halted", "<center>Search halted because a parameter was not provided properly.</center>");

      // Enable buttons for submit
      $('#searchDataBtn').removeAttr("disabled");

      // Remove message response
      $('#MessageResponse').html('').css('color', '#000000');
    }
    else
    {
      // Else proceed to send data to the server for processing
      // Store all data values into the JSON array value
      var JSONvalues = [{"param01": param01val}];

      // Retrieve the current part number server
      var url = window.location.protocol + '//' + window.location.host + '/';

      // Side note: if adding async:false would cause the ajax loader gif to not function properly
      // Send ajax variables to server-side
      $.ajax({
        url: url + "path/search_data_interaction.php",
        type: "POST",
        data: {JSONData:JSON.stringify(JSONvalues)},
        dataType: 'json',
        success: function(data)
        {
          // Check if server response is success
          if ($.trim(data.SRes) === "Success")
          {
            // Close the dialog
            $('#dialog').dialog("close"); // May not be needed

            // Display success message from the server-side
            $('#MessageResponse').html(data.Result).css('color', '#000000');
          }
          else
          {
            // Display dialog with message
            DialogMsg(data.SRes, 'Processed Completed', data.SMesg);

            // Remove message response
            $('#MessageResponse').html('').css('color', '#000000');
          }

          // Enable buttons for submit
          $('#searchDataBtn').removeAttr("disabled");

          // Make sure that the page does not change
          return false;
        },
        error: function(data)
        {
          // Display error message
          DialogMsg('Error', 'Process Completed', 'Error occurred while sending data. Try again.');

          // Enable buttons for submit
          $('#searchDataBtn').removeAttr("disabled");

          // Remove message response
          $('#MessageResponse').html('').css('color', '#000000');
        }
      });
    }
  }
}

// Insert, Update, or Delete Data Action
function iudDataAction()
{
  // Initialize parameter
  var optionMode = '';

  // On click take action
  $(document).on('click', "#insertData", function()
  {
    optionMode = 'insert';
    processDataInput(optionMode);
  });

  $(document).on('click', "#updateExistingData", function()
  {
    optionMode = 'update';
    processDataInput(optionMode);
  });

  $(document).on('click', "#removeExistingData", function()
  {
    optionMode = 'delete';
    processDataInput(optionMode);
  });

  // Process data information based on what button has been clicked
  function processDataInput(optionMode)
  {
    // Disable buttons on click
    $('#searchDataBtn').attr("disabled", "disabled");

    // Retrieve the element
    var insertButton = document.getElementById("insertData");

    // Check if the element exist
    if (insertButton !== null)
    {
      // Disable buttons on click
      $('#insertData').attr("disabled", "disabled");
    }

    // Retrieve the element
    var updateButton = document.getElementById("updateExistingData");

    // Check if the element exist
    if (updateButton !== null)
    {
      // Disable buttons on click
      $('#updateExistingData').attr("disabled", "disabled");
    }

    // Retrieve the element
    var deleteButton = document.getElementById("removeExistingData");

    // Check if the element exist
    if (deleteButton !== null)
    {
      // Disable buttons on click
      $('#removeExistingData').attr("disabled", "disabled");
    }

    // Display the ajax loading process image
    DialogBox("Processing Data");

    // Retrieve values and set regular expression
    var param01val = $('#param01Input').val();
    var pnregex = /^[a-zA-Z0-9\-]{1,}$/;
    var param02val = $('#param02Input').val();
    var tnregex = /^[a-zA-Z0-9\-]{1,}$/;
    var param03val = '';
    var ntnregex = /^[a-zA-Z0-9\-]{1,}$/;

    // Retrieve the element
    var param03Input = document.getElementById("param03Input");

    // Check if the element exist
    if (param03Input !== null)
    {
      // Store new translation to variable
      param03val = $('#param03Input').val();
    }

    // Check if value is given and follows the regular expression
    if(!param01val || !pnregex.test(param01val))
    {
      // Alert to the user that values are the same or there are empty inputs
      DialogMsg("Error", "Processing Halted", "<center>Process halted because parameter 01 was not provided properly.</center>");

      // Enable buttons for submit
      $('#searchDataBtn').removeAttr("disabled");

      // Check if the element exist
      if (insertButton !== null)
      {
        // Enable buttons on click
        $('#insertData').removeAttr("disabled");
      }

      // Check if the element exist
      if (updateButton !== null)
      {
        // Enable buttons on click
        $('#updateExistingData').removeAttr("disabled");
      }

      // Check if the element exist
      if (deleteButton !== null)
      {
        // Enable buttons on click
        $('#removeExistingData').removeAttr("disabled");
      }
    }
    else if(!param02val || !tnregex.test(param02val))
    {
      // Check if value is given and follows the regular expression
      // Alert to the user that values are the same or there are empty inputs
      DialogMsg("Error", "Processing Halted", "<center>Process halted because parameter 02 was not provided properly.</center>");

      // Enable buttons for submit
      $('#searchDataBtn').removeAttr("disabled");

      // Check if the element exist
      if (insertButton !== null)
      {
        // Enable buttons on click
        $('#insertData').removeAttr("disabled");
      }

      // Check if the element exist
      if (updateButton !== null)
      {
        // Enable buttons on click
        $('#updateExistingData').removeAttr("disabled");
      }

      // Check if the element exist
      if (deleteButton !== null)
      {
        // Enable buttons on click
        $('#removeExistingData').removeAttr("disabled");
      }
    }
    else if((!param03val || !ntnregex.test(param03val)) && param03Input !== null && optionMode !== 'delete')
    {
      // Check if value is given and follows the regular expression
      // Alert to the user that values are the same or there are empty inputs
      DialogMsg("Error", "Processing Halted", "<center>Process halted because parameter 03 was not provided properly.</center>");

      // Enable buttons for submit
      $('#searchDataBtn').removeAttr("disabled");

      // Check if the element exist
      if (insertButton !== null)
      {
        // Enable buttons on click
        $('#insertData').removeAttr("disabled");
      }

      // Check if the element exist
      if (updateButton !== null)
      {
        // Enable buttons on click
        $('#updateExistingData').removeAttr("disabled");
      }

      // Check if the element exist
      if (deleteButton !== null)
      {
        // Enable buttons on click
        $('#removeExistingData').removeAttr("disabled");
      }
    }
    else
    {
      // Else proceed to send data to the server for processing
      // Store all data values into the JSON array value
      var JSONvalues = [{"param01": param01val}, {"param02": param02val}, {"param03": param03val}, {"optionmode": optionMode}];

      // Retrieve the current part number server
      var url = window.location.protocol + '//' + window.location.host + '/';

      // Side note: if adding async:false would cause the ajax loader gif to not function properly
      // Send ajax variables to server-side
      $.ajax({
        url: url + "path/iud_data_interaction.php",
        type: "POST",
        data: {JSONData:JSON.stringify(JSONvalues)},
        dataType: 'json',
        success: function(data)
        {
          // Enable buttons for submit
          $('#searchDataBtn').removeAttr("disabled");

          // Check if server response is success
          if ($.trim(data.SRes) === "Success")
          {
            // Display dialog with message
            DialogMsg(data.SRes, 'Processed Completed', data.SMesg);

            // Clear input box
            $('#dataInputText').val('');

            // Remove message response
            $('#MessageResponse').html('').css('color', '#000000');
          }
          else
          {
            // Display dialog with message
            DialogMsg(data.SRes, 'Processed Completed', data.SMesg);

            // Check if the element exist
            if (insertButton !== null)
            {
              // Enable buttons on click
              $('#insertData').removeAttr("disabled");
            }

            // Check if the element exist
            if (updateButton !== null)
            {
              // Enable buttons on click
              $('#updateExistingData').removeAttr("disabled");
            }

            // Check if the element exist
            if (deleteButton !== null)
            {
              // Enable buttons on click
              $('#removeExistingData').removeAttr("disabled");
            }
          }

          // Make sure that the page does not change
          return false;
        },
        error: function(data)
        {
          // Display error message
          DialogMsg('Error', 'Process Completed', 'Error occurred while sending data. Try again.');

          // Enable buttons for submit
          $('#searchDataBtn').removeAttr("disabled");

          // Check if the element exist
          if (insertButton !== null)
          {
            // Enable buttons on click
            $('#insertData').removeAttr("disabled");
          }

          // Check if the element exist
          if (updateButton !== null)
          {
            // Enable buttons on click
            $('#updateExistingData').removeAttr("disabled");
          }

          // Check if the element exist
          if (deleteButton !== null)
          {
            // Enable buttons on click
            $('#removeExistingData').removeAttr("disabled");
          }
        }
      });
    }
  }
}

// Extract Data Information
function extractDataInformation()
{
  // On click take action
  $('#extractDataBtn').on('click', function()
  {
    // Disable buttons on click
    $('#extractDataBtn').attr("disabled", "disabled");

    // Display the ajax loading process image
    DialogBox("Extracting Record(s)");

    // Retrieve the current domain name server
    var url = window.location.protocol + '//' + window.location.host + '/';

    // Store all data values into the JSON array value
    var JSONvalues = [{"allowed": "yes"}];

    // Send ajax variables to server-side
    $.ajax({
      url: url + "path/extract_data_information.php",
      type: "POST",
      data: {JSONData:JSON.stringify(JSONvalues)},
      dataType: 'json',
      success: function(data)
      {
        // Check if successfully executed
        if(data.SRes === "Success")
        {
          // Close the dialog
          $('#dialog').dialog("close");

          // Store file name value into hidden input field
          window.location = url + "path/requestExportReport.php?file=" + data.Result.filename;
        }
        else
        {
          // Display dialog with message
          DialogMsg(data.SRes, 'Processed Completed', data.SMesg);
        }

        // Enable buttons for submit
        $('#extractDataBtn').removeAttr("disabled");

        // Stop the Ajax from processing anything else
        return false;
      },
      error: function(data)
      {
        // Display error message
        DialogMsg('Error', 'Process Completed', 'Error occurred while sending data. Try again.');

        // Enable buttons for submit
        $('#extractDataBtn').removeAttr("disabled");
      }
    });
  });
}