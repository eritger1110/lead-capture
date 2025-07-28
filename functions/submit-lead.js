const https = require("https" );
const querystring = require("querystring");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST' ) {
    console.log('❌ Non-POST request received:', event.httpMethod );
    return {
      statusCode: 405,
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the form data
    const formData = querystring.parse(event.body);
    
    // Enhanced logging for Netlify's form backup
    console.log('=== NETLIFY FORM SUBMISSION BACKUP ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Event ID:', context.awsRequestId);
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    console.log('User Agent:', event.headers['user-agent'] || 'Unknown');
    console.log('IP Address:', event.headers['x-forwarded-for'] || event.headers['x-nf-client-connection-ip'] || 'Unknown');
    console.log('=====================================');

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      // Still proceed but log the issue
    }

    // Prepare data for Salesforce submission
    const postData = querystring.stringify(formData);
    
    console.log('📤 Submitting to Salesforce...');
    console.log('Data length:', postData.length);
    console.log('OID:', formData.oid);
    console.log('Return URL:', formData.retURL);

    const options = {
      hostname: 'webto.salesforce.com',
      path: '/servlet/servlet.WebToLead?encoding=UTF-8',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'User-Agent': 'Netlify-Function/1.0 (fair-lead-capture)'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res ) => {
        console.log('📥 Salesforce response status:', res.statusCode);
        console.log('📥 Salesforce response headers:', JSON.stringify(res.headers, null, 2));
        
        let responseBody = '';
        
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log('✅ Successfully submitted to Salesforce');
            console.log('Response body length:', responseBody.length);
          } else {
            console.log('⚠️ Salesforce returned non-success status:', res.statusCode);
            console.log('Response body:', responseBody.substring(0, 500)); // Log first 500 chars
          }
          
          // Determine redirect URL
          const redirectUrl = formData.retURL || "/thank-you.html";
          console.log('🔄 Redirecting to:', redirectUrl);
          
          resolve({
            statusCode: 302,
            headers: {
              'Location': redirectUrl,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            body: "Redirecting to thank-you page..."
          });
        });
      });

      req.on('error', (error) => {
        console.error('❌ Salesforce submission failed:', error.message);
        console.error('Error details:', {
          code: error.code,
          errno: error.errno,
          syscall: error.syscall,
          hostname: error.hostname
        });
        
        // Still redirect user to thank-you page even if Salesforce fails
        // The form data is already logged to Netlify as backup
        const redirectUrl = formData.retURL || "/thank-you.html";
        console.log('🔄 Redirecting despite error to:', redirectUrl);
        
        resolve({
          statusCode: 302,
          headers: {
            'Location': redirectUrl + '?error=sf_failed',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          body: "Redirecting to thank-you page..."
        });
      });

      req.on('timeout', () => {
        console.error('❌ Salesforce request timed out');
        req.destroy();
        
        const redirectUrl = formData.retURL || "/thank-you.html";
        resolve({
          statusCode: 302,
          headers: {
            'Location': redirectUrl + '?error=timeout',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          body: "Redirecting to thank-you page..."
        });
      });

      // Set timeout to 10 seconds
      req.setTimeout(10000);
      
      req.write(postData);
      req.end();
    });

  } catch (error) {
    console.error('❌ Unexpected error in form handler:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Event body:', event.body);
    
    // Always try to redirect user even on unexpected errors
    return {
      statusCode: 302,
      headers: {
        'Location': '/thank-you.html?error=unexpected',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: "Redirecting to thank-you page..."
    };
  }
};
