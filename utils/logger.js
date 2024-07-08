// utils/logger.js
const logger = {
    log: (message, ...optionalParams) => {
      console.log(`[LOG] ${message}`, ...optionalParams);
    },
    error: (message, ...optionalParams) => {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    },
  };
  
  export default logger;
  