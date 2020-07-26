<?php
  /*
          File: requestExportReport.php
       Created: 07/26/2020
       Updated: 07/26/2020
    Programmer: Cuates
    Updated By: Cuates
       Purpose: Server-side script to handle file download from the server
  */

  // Get file information
  $filename = basename($_GET['file']);

  // Set file at the given location
  $filename = '/var/www/html/Temp_Directory/' . $filename;

  if(file_exists($filename))
  {
    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename=" . basename($filename));
    header("Content-Transfer-Encoding: binary");

    // read the file from disk
    readfile($filename);
  }
  else
  {
    // Echo error from page
    echo "File does not exist.";
  }
?>