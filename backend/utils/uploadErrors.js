const handleUploadError = (err) => {
  if (err.name === 'MulterError') {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return 'File is too large. Maximum size is 5MB';
      case 'LIMIT_FILE_COUNT':
        return 'Too many files uploaded';
      case 'LIMIT_UNEXPECTED_FILE':
        return 'Invalid file type. Only images are allowed';
      default:
        return 'Error uploading file';
    }
  }
  
  if (err.message.includes('Invalid file type')) {
    return 'Only JPG, JPEG, and PNG files are allowed';
  }

  return 'Server error during file upload';
};

module.exports = handleUploadError; 