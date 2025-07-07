# Layer 1 Specification for Mortgage App

**Status:** Introduction Layer Complete  
**Next Phase:** Layer 1 Implementation

---

## What the Client Wants Built Next

Based on the Layer 1 specification, here's what needs to be implemented:

### 1. Platform-Specific Introduction Screens

#### Apple App
- **Introduction Screen:**  
  - White background  
  - Blue text displaying: `Hello!`  
  - This color scheme will be used for all Apple introduction screens.

#### Android App
- **Introduction Screen:**  
  - White background  
  - Green text displaying: `Hello!`  
  - This color scheme will be used for all Android introduction screens.

---

### 2. User Introduction Flow

The client wants a complete animated introduction sequence:

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

### 3. Educational Content (Terminology Section)

The client wants an education section with detailed explanations of key mortgage terms:

#### FICO Score Section
- **Definition:** Fair Isaac Corporation credit scoring system
- **Purpose:** Numerical representation of credit risk (300-850 range)
- **Details to include:**
  - Company background (Bill Fair and Earl Isaac)
  - Score range explanation
  - Credit report information sources
  - Benefits of high FICO scores

#### LTV (Loan To Value) Section
- **Definition:** Ratio comparing loan amount to property value
- **Calculation:** `LTV = Loan Amount / Appraised Property Value`
- **Real example:** Home price $500,000, Loan $400,000 = 80% LTV
- **Importance explanations:**
  - Risk assessment
  - Loan approval criteria
  - Interest rate impacts
  - Mortgage insurance requirements
  - Home equity implications

#### DTI (Debt To Income) Section
- **Definition:** Monthly debt payments vs. gross monthly income
- **Calculation steps:**
  - List all monthly debt payments
  - Calculate gross monthly income
  - Divide debt by income for percentage
- **What constitutes "good" DTI (40-45%, max 50%)

---

## Technical Implementation Requirements

### Animation Requirements
- Smooth box animations moving toward user
- Platform-specific color schemes (iOS: blue, Android: green)
- Sequential flow from intro → data collection → transition

### Data Collection
- Form validation for name, phone, email
- Proper input field styling
- Data persistence for user information

### Educational Content
- Scrollable content sections
- Clear typography hierarchy
- Examples and calculations
- User-friendly explanations of complex terms

---

## Priority Order for Implementation

1. **Platform-specific Hello screens** (iOS blue, Android green)
2. **Animated introduction flow** ("Hi, I am Simple" → "You are?")
3. **User data collection forms** (Name, Phone, Email)
4. **Transition animation** ("Let's Get Started")
5. **Educational content sections** (FICO, LTV, DTI)

This Layer 1 focuses on user onboarding and education before moving to actual mortgage application features.