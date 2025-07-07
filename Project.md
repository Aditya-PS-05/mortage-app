
## Layer One Document for Mortgage App (US Market)

### Introduction

This document outlines the foundational layer design and security considerations for a mortgage application tailored for users in the United States. The app aims to provide a seamless, user-friendly experience for users interested in buying mortgages, ensuring clarity, ease of navigation, and robust security.

### Look and Feel of the App

**1. User Interface and Navigation**

- The app will feature a clean and simple design to enhance user experience.
- Navigation will be intuitive, with clear, prominent buttons such as ‘Previous’ and ‘Next’ to guide users through the mortgage application process step-by-step.
- All elements will be designed to be easily visible and accessible, minimizing clutter and confusion.

**2. Color Scheme**

- The primary color palette will include blues, white, and gray, creating a calm and trustworthy atmosphere.
- Alternatively, a black and white theme can be used for a minimalist, professional look.
- The colors will be chosen to ensure good contrast and readability across all devices.

**3. Additional Recommendations**

- Consider incorporating subtle animations or progress indicators to show users where they are in the application process.
- Use consistent typography and spacing to maintain a clean layout.
- Include tooltips or brief explanations for complex terms to assist users unfamiliar with mortgage jargon.
- Ensure the design is responsive and mobile-friendly, as many users will access the app via smartphones.


### Security Considerations

**1. Login Credentials**

- Users can log in using their phone number, email address, or a username, providing flexibility.
- The login process will be designed to be straightforward yet secure.

**2. Two-Factor Authentication (2FA)**

- To enhance security, 2FA will be implemented.
- An example method is sending a one-time security code via SMS to the phone number linked to the user’s account.
- This extra step will verify that the login attempt is legitimate and protect against unauthorized access.

**3. Additional Security Recommendations**

- Use encrypted connections (HTTPS) throughout the app to protect data in transit.
- Store sensitive user data securely with encryption at rest.
- Implement account lockout mechanisms after multiple failed login attempts to prevent brute force attacks.
- Regularly update and patch the app to protect against emerging security vulnerabilities.
- Consider biometric authentication (fingerprint or facial recognition) as an optional login method for enhanced convenience and security on supported devices.

This foundational layer will ensure the mortgage app is both accessible and secure, providing users with confidence and ease throughout their mortgage buying journey. Further layers can build upon this base to add features and functionality as needed.


# Layer 1 Specification for Mortgage App

**Estimated Hours:**  
**Actual Hours:**  

---

## Apple App

- **Introduction Screen:**  
  - White background  
  - Blue text displaying: `Hello!`  
  - This color scheme will be used for all Apple introduction screens.

---

## Android App

- **Introduction Screen:**  
  - White background  
  - Green text displaying: `Hello!`  
  - This color scheme will be used for all Android introduction screens.

---

## User Introduction Flow

1. **Animated Introduction:**  
   - After the `Hello!` screen, a box animates toward the user and introduces itself as:  
     `"Hi, I am Simple."`
   - The app then asks:  
     `"You are?"`

2. **User Information Collection:**  
   - Three individual input boxes appear, prompting the user to enter:  
     - Name  
     - Phone Number  
     - Email

3. **Transition to Home Screen:**  
   - After entering details, another box animates toward the user, saying:  
     `"Let's Get Started."`

---

## Terminology (Education Section)

### 1. FICO

- **Definition:**  
  FICO stands for Fair Isaac Corporation, the company that developed the widely used FICO credit scoring system.
- **Purpose:**  
  FICO scores are numerical representations of a consumer's credit risk, based on information from their credit reports. Lenders use these scores to assess loan or credit card applications, set interest rates, and determine credit limits.

- **Details:**
  - **A. Fair Isaac Corporation:**  
    The name “FICO” comes from founders Bill Fair and Earl Isaac.
  - **B. Score Range:**  
    Typically 300 to 850; higher scores indicate lower credit risk.
  - **C. Credit Report Information:**  
    Calculated using data from Equifax, Experian, and TransUnion.
  - **D. Creditworthiness Assessment:**  
    Helps lenders determine the likelihood of repayment.
  - **E. Benefits of High FICO:**  
    Better loan terms, lower interest rates, increased access to credit.

---

### 2. LTV (Loan To Value)

- **Definition:**  
  The Loan-to-Value (LTV) ratio compares the loan amount to the value of the asset being financed, usually as a percentage.
- **Calculation:**  
  `LTV = Loan Amount / Appraised Property Value`
- **Example:**  
  Home price: $500,000; Loan: $400,000  
  `LTV = $400,000 / $500,000 = 80%`

- **Importance in Real Estate:**
  - **A. Risk Assessment:**  
    Higher LTV = greater risk for lender; lower LTV = more borrower equity, less risk.
  - **B. Loan Approval:**  
    Lenders have maximum LTV limits; your LTV affects eligibility.
  - **C. Interest Rates:**  
    Lower LTV usually means lower interest rates.
  - **D. Mortgage Insurance:**  
    LTV above 80% typically requires private mortgage insurance (PMI).
  - **E. Home Equity:**  
    Lower LTV = more equity, enabling access to home equity loans or HELOCs.

- **Good vs. High LTV:**  
  - **Good LTV:** 80% or below (avoids PMI, secures better rates)  
  - **High LTV:** 90% or above (usually requires PMI)

---

### 3. DTI (Debt To Income)

- **Definition:**  
  Debt-to-Income (DTI) ratio compares your monthly debt payments to your gross monthly income, expressed as a percentage.
- **Calculation Steps:**
  1. **Add up total monthly debt payments:**  
     - Mortgage/rent  
     - Minimum credit card payments  
     - Car loans  
     - Student loans  
     - Personal loans  
     - Child support/alimony  
     *(Do NOT include utilities, groceries, insurance premiums)*
  2. **Calculate gross monthly income:**  
     - Income before taxes and deductions.
  3. **Divide total debt by gross income:**  
     - `DTI Ratio = Total Monthly Debt Payments / Gross Monthly Income`

- **Importance:**  
  - Lenders use DTI to assess your ability to repay loans.
  - Low DTI = less risky borrower.

- **What is a “Good” DTI Ratio?**  
  - Typically 40%-45% (maximum 50%).

---

*End of Layer 1 Specification*
