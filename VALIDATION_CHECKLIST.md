# 🔍 Lead Capture Site Validation Checklist

## Pre-Deployment Validation

### ✅ File Structure Check
- [ ] `index.html` - Main form page
- [ ] `thank-you.html` - Success page
- [ ] `lhs-logo.png` - Official logo file
- [ ] `netlify.toml` - Configuration file
- [ ] `functions/submit-lead.js` - Serverless function
- [ ] `README.md` - Documentation

### ✅ Form Configuration Check
- [ ] Form has `data-netlify="true"` attribute
- [ ] Form has `name="backup-lead-form"` attribute
- [ ] Form action points to `/.netlify/functions/submit-lead`
- [ ] All required fields have `required` attribute
- [ ] Salesforce OID is correct: `00D8b0000023HqA`
- [ ] Return URL is set to `/thank-you.html`

### ✅ Function Configuration Check
- [ ] Function handles POST requests only
- [ ] Function logs form data for backup
- [ ] Function forwards to Salesforce Web-To-Lead API
- [ ] Function handles errors gracefully
- [ ] Function redirects to thank-you page

## Post-Deployment Validation

### ✅ Netlify Dashboard Check
1. **Site Overview**
   - [ ] Site deploys successfully
   - [ ] No build errors
   - [ ] Functions are detected and deployed

2. **Forms Tab**
   - [ ] Form is detected: "backup-lead-form"
   - [ ] Form submissions appear here after testing

3. **Functions Tab**
   - [ ] `submit-lead` function is listed
   - [ ] Function logs are accessible

### ✅ Live Site Testing

#### Visual Check
- [ ] Logo displays correctly
- [ ] Form layout looks professional
- [ ] All form fields are visible
- [ ] Submit button is prominent
- [ ] Mobile responsive design works

#### Functionality Check
- [ ] Fill out form with test data
- [ ] Form validates required fields
- [ ] Form submits without JavaScript errors
- [ ] User is redirected to thank-you page
- [ ] Thank-you page displays correctly

#### Backend Check
- [ ] Check Netlify Forms dashboard for submission
- [ ] Check function logs for execution details
- [ ] Verify Salesforce received the lead (if accessible)

### ✅ Error Handling Test

#### Simulate Salesforce Failure
1. Temporarily change Salesforce URL in function
2. Submit form
3. Verify:
   - [ ] User still redirected to thank-you page
   - [ ] Form still logged in Netlify Forms
   - [ ] Error logged in function console
   - [ ] Thank-you page shows error message

#### Test Required Field Validation
- [ ] Try submitting with empty required fields
- [ ] Browser prevents submission
- [ ] Appropriate validation messages shown

## 🚨 Critical Success Criteria

For 100% reliability, verify ALL of these:

1. **Dual Submission Working**
   - ✅ Netlify Forms captures submission
   - ✅ Function forwards to Salesforce
   - ✅ Both work independently

2. **Error Recovery Working**
   - ✅ If Salesforce fails, Netlify backup still works
   - ✅ User always gets success page
   - ✅ No data is lost

3. **Monitoring Working**
   - ✅ All submissions logged in Netlify dashboard
   - ✅ Function logs provide debugging info
   - ✅ Errors are clearly identified

## 📋 Test Data Template

Use this test data for validation:

```
First Name: Test
Last Name: User
Email: test@example.com
Phone: (555) 123-4567
Address: 123 Test St
City: Madison
State: WI
Zip: 53703
Lead Source Category: Fair
Lead Source Detail: Washington County Fair
Assigned Sales Rep: (leave blank or select any)
Service(s) of Interest: Radon Testing
```

## 🎯 Success Confirmation

✅ **DEPLOYMENT SUCCESSFUL** when:
- Form submits without errors
- User sees thank-you page
- Submission appears in Netlify Forms
- Function logs show successful execution
- No console errors in browser

✅ **100% RELIABILITY CONFIRMED** when:
- Test with Salesforce working: Both systems capture lead
- Test with Salesforce broken: Netlify still captures lead
- All error scenarios handled gracefully
- No data loss in any scenario

---

## 🔧 Quick Fixes for Common Issues

**Form not submitting:**
```html
<!-- Ensure form has these attributes -->
<form data-netlify="true" name="backup-lead-form" action="/.netlify/functions/submit-lead" method="POST">
```

**Function not found:**
```toml
# Ensure netlify.toml has:
[build]
  functions = "functions"
```

**Salesforce not receiving:**
- Check OID: `00D8b0000023HqA`
- Verify Web-To-Lead is enabled in Salesforce
- Check function logs for Salesforce response

Remember: Even if Salesforce fails, Netlify backup ensures NO LEADS ARE LOST! 🛡️

