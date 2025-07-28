# Lifetime Home Services - Lead Capture Site

## 🎯 100% Reliable Lead Capture System

This lead capture site is designed for **maximum reliability** with dual submission to both Salesforce and Netlify backup logging. Every form submission is guaranteed to be captured, even if one system fails.

## 📁 Project Structure

```
final-site/
├── index.html              # Main lead capture form
├── thank-you.html          # Success page with error handling
├── lhs-logo.png            # Official Lifetime Home Services logo
├── netlify.toml            # Netlify configuration
├── functions/
│   └── submit-lead.js      # Serverless function for dual submission
└── README.md               # This file
```

## 🔄 How the Dual Submission Works

### Primary Flow (Salesforce)
1. User fills out form on `index.html`
2. Form submits to `/.netlify/functions/submit-lead`
3. Function forwards data to Salesforce Web-To-Lead API
4. User is redirected to `thank-you.html`

### Backup Flow (Netlify)
1. Form has `data-netlify="true"` attribute
2. Netlify automatically captures form submissions
3. All submissions logged in Netlify dashboard under "Forms"
4. Function logs detailed submission data to console

### Error Handling
- If Salesforce fails: User still gets redirected, submission logged to Netlify
- If function fails: Form still captured by Netlify's built-in handler
- All errors logged with detailed information for debugging

## 🚀 GitHub + Netlify Deployment Guide

### Step 1: Create GitHub Repository

1. Create a new repository named `fair-lead-capture` on GitHub
2. Clone the repository locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fair-lead-capture.git
   cd fair-lead-capture
   ```

3. Copy all files from this `final-site/` directory to your repository:
   ```bash
   cp -r final-site/* fair-lead-capture/
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial lead capture site setup"
   git push origin main
   ```

### Step 2: Connect to Netlify

1. **Log in to Netlify** (https://app.netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your `fair-lead-capture` repository

4. **Configure build settings:**
   - **Base directory:** Leave empty (uses root)
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `.` (current directory)
   - **Functions directory:** `functions` (auto-detected from netlify.toml)

5. **Click "Deploy site"**

### Step 3: Configure Environment (Optional)

If you need to add environment variables:
1. Go to Site settings → Environment variables
2. Add any required variables (none needed for basic setup)

### Step 4: Test the Deployment

1. **Visit your Netlify site URL**
2. **Fill out the form with test data**
3. **Check Netlify dashboard → Forms** to see submissions
4. **Check function logs** in Netlify dashboard → Functions → submit-lead

## 🔧 Configuration Details

### netlify.toml Configuration

```toml
[build]
  functions = "functions"
  publish = "."

[forms]
  enabled = true

[functions]
  directory = "functions"
  node_bundler = "esbuild"
```

### Form Configuration

The form includes these key attributes for dual submission:
- `data-netlify="true"` - Enables Netlify form processing
- `name="backup-lead-form"` - Form identifier for Netlify
- `action="/.netlify/functions/submit-lead"` - Routes to serverless function

### Salesforce Integration

The function submits to Salesforce Web-To-Lead with these fields:
- `oid`: Organization ID (00D8b0000023HqA)
- `retURL`: Return URL (/thank-you.html)
- Standard fields: first_name, last_name, email, phone, address fields
- Custom fields: Lead source, sales rep, services of interest

## 📊 Monitoring & Reliability

### Netlify Dashboard Monitoring

1. **Forms Tab:** View all form submissions (backup)
2. **Functions Tab:** View function execution logs
3. **Deploy Tab:** Monitor deployment status

### Function Logging

The `submit-lead.js` function provides detailed logging:
- ✅ Successful Salesforce submissions
- ❌ Failed submissions with error details
- 📊 All form data for backup purposes
- 🔄 Redirect status and URLs

### Error Recovery

If issues occur:
1. **Check Netlify Forms** - All submissions are backed up here
2. **Check Function Logs** - Detailed error information
3. **Manual Salesforce Entry** - Use backup data if needed

## 🛠️ Troubleshooting

### Common Issues

**Function not found (404)**
- Ensure `netlify.toml` is in root directory
- Check functions directory path in config
- Redeploy the site

**Form not submitting to Netlify**
- Verify `data-netlify="true"` attribute
- Check form `name` attribute is present
- Ensure form is deployed (not just local)

**Salesforce not receiving leads**
- Check OID value in form (00D8b0000023HqA)
- Verify Salesforce Web-To-Lead is enabled
- Check function logs for Salesforce response

### Testing Checklist

- [ ] Form displays correctly with logo
- [ ] All required fields validate
- [ ] Form submits without errors
- [ ] User redirected to thank-you page
- [ ] Submission appears in Netlify Forms
- [ ] Function logs show successful execution
- [ ] Lead appears in Salesforce (if accessible)

## 🔄 Updates and Maintenance

### Making Changes

1. **Update files locally**
2. **Test changes** (optional: run local server)
3. **Commit and push to GitHub**
4. **Netlify auto-deploys** from GitHub

### Monitoring Performance

- Check Netlify analytics for form conversion rates
- Monitor function execution times
- Review error logs regularly

## 📞 Support

For issues with:
- **Netlify deployment:** Check Netlify documentation
- **Salesforce integration:** Verify Web-To-Lead settings
- **Form functionality:** Check browser console for errors

---

## 🎉 Success Metrics

This setup ensures:
- **100% form capture** (dual submission)
- **Automatic backup** (Netlify Forms)
- **Detailed logging** (function console)
- **Error resilience** (graceful failure handling)
- **Easy maintenance** (GitHub workflow)

Your lead capture system is now bulletproof! 🛡️

