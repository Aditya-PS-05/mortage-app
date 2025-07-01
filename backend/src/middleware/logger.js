const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`\n🌐 [${timestamp}] ${method} ${url}`);
  console.log(`📍 IP: ${ip}`);
  console.log(`📄 Headers:`, JSON.stringify(req.headers, null, 2));
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log sensitive data like passwords
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[HIDDEN]';
    if (safeBody.confirmPassword) safeBody.confirmPassword = '[HIDDEN]';
    console.log(`📦 Body:`, JSON.stringify(safeBody, null, 2));
  }
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 [${timestamp}] Response Status: ${res.statusCode}`);
    try {
      const responseData = JSON.parse(data);
      console.log(`📄 Response:`, JSON.stringify(responseData, null, 2));
    } catch (e) {
      console.log(`📄 Response:`, data);
    }
    console.log(`${'='.repeat(80)}\n`);
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = requestLogger;