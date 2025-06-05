"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  Home,
  FileText,
  User,
  Bell, // Added for PIN screen warning
  Settings,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  LogOut,
  UploadCloud,
  Menu,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Briefcase,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Bike,
  Clock,
} from "lucide-react";

// App Name (Can be changed)
const APP_NAME = "CPU Retirement Plan Office";
const APP_PIN_LENGTH = 6; // Define PIN length globally for consistency

// Predefined loan display order for consistent UI experience
const LOAN_DISPLAY_ORDER = [
  "Emergency Loan",
  "Regular Loan",
  "Special Loan",
  "Short Term Loan",
  "Car Loan",
  "Motorcycle Loan",
];

// Function to sort loans according to predefined display order
const sortLoansByDisplayOrder = (loans) => {
  return [...loans].sort((a, b) => {
    const indexA = LOAN_DISPLAY_ORDER.indexOf(a.name);
    const indexB = LOAN_DISPLAY_ORDER.indexOf(b.name);

    // If both loans are in the predefined order, sort by their order index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one loan is in the predefined order, prioritize it
    if (indexA !== -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB !== -1) {
      return 1;
    }

    // If neither loan is in the predefined order, maintain original order
    return 0;
  });
};

// --- Mock Data Structures (Keep existing data structures) ---
const defaultMockUser = {
  id: "user1",
  cpuld: "12-3456-78",
  surname: "Dela Cruz",
  firstname: "Juan",
  middlename: "Ponce",
  cpuEmail: "user@cpu.edu.ph",
  birthdate: "1985-07-15",
  civilStatus: "Married",
  sex: "Male",
  dateOfMembership: "2010-06-01",
  fsClassification: "Faculty",
  department: "College of Engineering",
  dateHired: "2010-06-01",
  contactNumber: "09123456789",
  netPay: 25000, // Monthly net pay for Regular Loan eligibility
  isActive: true,
  pin: "123456", // Default PIN for existing user
  hasPin: true,
  profileComplete: true,
};

const newMockUserBaseTemplate = {
  id: "",
  cpuld: "98-7654-32",
  surname: "Santos",
  firstname: "Maria",
  middlename: "Rosario", // Pre-populate middle name for new users too
  cpuEmail: "",
  department: "College of Arts and Sciences",
  birthdate: "1990-03-15", // Pre-populate birthdate
  civilStatus: "Single", // Pre-populate civil status
  sex: "Female", // Pre-populate sex
  contactNumber: "09987654321", // Pre-populate contact number
  dateOfMembership: "",
  fsClassification: "",
  dateHired: "",
  netPay: 15000, // Monthly net pay for Regular Loan eligibility
  isActive: true,
  pin: "",
  hasPin: false,
  profileComplete: true, // Set to true since we're removing profile completion flow
};

const mockEquities = [
  {
    id: "eq1",
    userId: "user1",
    employeeNo: "12-3456-78",
    employeeName: "Juan Ponce Dela Cruz",
    statementPeriod: {
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      asOfDate: "2023-12-31",
    },
    startingBalance: {
      yourContributions: 45000,
      employerContributions: 38000,
      yourEarnings: 3200,
      employerEarnings: 2800,
      total: 89000,
    },
    activityThisPeriod: {
      yourNewContributions: 12000,
      employerNewContributions: 10000,
      yourNewEarnings: 2800,
      employerNewEarnings: 2400,
    },
    endingBalance: {
      yourContributions: 57000,
      employerContributions: 48000,
      yourEarnings: 6000,
      employerEarnings: 5200,
      total: 116200,
    },
    // Legacy fields for backward compatibility
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    contribution: 12000,
    withdrawals: 0,
    endingEquity: 116200,
    beginningBalance: { contribution: 83000, income: 6000 },
  },
  {
    id: "eq_new_user_placeholder",
    userId: "newMockUserIdPlaceholder",
    employeeNo: "98-7654-32",
    employeeName: "Maria Rosario Santos",
    statementPeriod: {
      startDate: "",
      endDate: "",
      asOfDate: "",
    },
    startingBalance: {
      yourContributions: 0,
      employerContributions: 0,
      yourEarnings: 0,
      employerEarnings: 0,
      total: 0,
    },
    activityThisPeriod: {
      yourNewContributions: 0,
      employerNewContributions: 0,
      yourNewEarnings: 0,
      employerNewEarnings: 0,
    },
    endingBalance: {
      yourContributions: 0,
      employerContributions: 0,
      yourEarnings: 0,
      employerEarnings: 0,
      total: 0,
    },
    // Legacy fields for backward compatibility
    startDate: "",
    endDate: "",
    contribution: 0,
    withdrawals: 0,
    endingEquity: 0,
    beginningBalance: { contribution: 0, income: 0 },
  },
];

const mockActiveLoans = [
  {
    id: "loan1",
    userId: "user1",
    loanCode: "RL2023-001",
    dateApplied: "2023-01-10",
    outstandingLoan: 45000.75,
    outstandingLoanDate: "2024-05-01",
    loanTypeDetail: "Regular Loan",
    dateReleased: "2023-01-20",
    maturityDate: "2025-01-20",
    numYearsToPay: 2,
    pnAmount: 60000,
    dateGranted: "2023-01-15",
    interestRate: "1.2%",
    repaymentAmount: 2600,
  },
  {
    id: "loan2",
    userId: "user1",
    loanCode: "EL2024-005",
    dateApplied: "2024-03-01",
    outstandingLoan: 9800.0,
    outstandingLoanDate: "2024-05-01",
    loanTypeDetail: "Emergency Loan",
    amountGranted: 10000,
    numOfTerms: 6,
    interestRate: "1.0%",
    repaymentAmount: 1700,
    dateGranted: "2024-03-05",
    dateReleased: "2024-03-06",
    maturityDate: "2024-09-05",
  },
];

const mockLoanBreakdown = [
  {
    paymentDate: "2023-02-20",
    principalAmortization: 2400,
    interestPaid: 200,
    remainingBalance: 57600,
  },
  {
    paymentDate: "2023-03-20",
    principalAmortization: 2420,
    interestPaid: 180,
    remainingBalance: 55180,
  },
  {
    paymentDate: "2023-04-20",
    principalAmortization: 2440,
    interestPaid: 160,
    remainingBalance: 52740,
  },
  {
    paymentDate: "2023-05-20",
    principalAmortization: 2460,
    interestPaid: 140,
    remainingBalance: 50280,
  },
  {
    paymentDate: "2023-06-20",
    principalAmortization: 2480,
    interestPaid: 120,
    remainingBalance: 47800,
  },
  {
    paymentDate: "2023-07-20",
    principalAmortization: 2500,
    interestPaid: 100,
    remainingBalance: 45300,
  },
  {
    paymentDate: "2023-08-20",
    principalAmortization: 2520,
    interestPaid: 80,
    remainingBalance: 42780,
  },
  {
    paymentDate: "2023-09-20",
    principalAmortization: 2540,
    interestPaid: 60,
    remainingBalance: 40240,
  },
  {
    paymentDate: "2023-10-20",
    principalAmortization: 2560,
    interestPaid: 40,
    remainingBalance: 37680,
  },
  {
    paymentDate: "2023-11-20",
    principalAmortization: 2580,
    interestPaid: 20,
    remainingBalance: 35100,
  },
  // Future payments (projected)
  {
    paymentDate: "2023-12-20",
    principalAmortization: 2600,
    interestPaid: 50,
    remainingBalance: 32500,
    isProjected: true,
  },
  {
    paymentDate: "2024-01-20",
    principalAmortization: 2620,
    interestPaid: 30,
    remainingBalance: 29880,
    isProjected: true,
  },
  {
    paymentDate: "2024-02-20",
    principalAmortization: 2640,
    interestPaid: 10,
    remainingBalance: 27240,
    isProjected: true,
  },
  {
    paymentDate: "2024-03-20",
    principalAmortization: 2660,
    interestPaid: 15,
    remainingBalance: 24580,
    isProjected: true,
  },
  {
    paymentDate: "2024-04-20",
    principalAmortization: 2680,
    interestPaid: 25,
    remainingBalance: 21900,
    isProjected: true,
  },
  {
    paymentDate: "2024-05-20",
    principalAmortization: 2700,
    interestPaid: 35,
    remainingBalance: 19200,
    isProjected: true,
  },
];

const mockEligibleLoans = [
  {
    id: "el1",
    name: "Regular Loan",
    description:
      "General purpose loan with standard terms for various financial needs.",
    detailedDescription:
      "A comprehensive loan option designed for members with established equity. Perfect for home improvements, education expenses, or other significant financial needs. Requires comprehensive documentation and has competitive interest rates.",
    eligible: true,
    type: "Regular",
    icon: Briefcase,
    minAmount: 1000,
    maxAmount: 600000,
    maxAmountNotes: "",
    minEquityRequired: 50000,
    minTenureMonths: 12, // Based on 1 year minimum for 5-9 months membership
    interestRate: "7%",
    interestRateTypeDescription:
      "per annum, calculated based on the diminishing principal balance",
    minTermDescription: "1 year (for 5-9 mos. membership)",
    maxTermDescription: "6 years (for 20+ years membership)",
    termOptions: [
      "1 year",
      "2 years",
      "3 years",
      "4 years",
      "5 years",
      "6 years",
    ],
    validationRulesNotes: "Refer to Key Regular Loan Conditions",
    otherConditionsNotes:
      "Refer to Key Regular Loan Conditions below. Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      sssNumber: false,
      tinNumber: true,
      schoolIdFront: true,
      schoolIdBack: true,
      govIdFront: true,
      govIdBack: true,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: true,
  },
  {
    id: "el2",
    name: "Special Loan",
    description: "Loan for specific occasions or needs, may have unique terms.",
    detailedDescription:
      "Designed for special circumstances and occasions such as medical emergencies, educational opportunities, or important family events. Offers flexible terms tailored to specific member needs.",
    eligible: true,
    type: "Special",
    icon: Star,
    minAmount: 1000,
    maxAmount: 20000,
    maxAmountNotes: "",
    minEquityRequired: 30000,
    minTenureMonths: 6,
    interestRate: "7%",
    interestRateTypeDescription: "per annum, diminishing",
    minTermDescription: "6 months (fixed)",
    maxTermDescription: "6 months (fixed)",
    termOptions: ["6 months"],
    validationRulesNotes: "Refer to Key Special Loan Conditions",
    otherConditionsNotes:
      "Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      sssNumber: false,
      tinNumber: true,
      schoolIdFront: false,
      schoolIdBack: false,
      govIdFront: false,
      govIdBack: false,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: true,
  },
  {
    id: "el3",
    name: "Emergency Loan",
    description: "For unforeseen urgent financial needs.",
    detailedDescription:
      "Quick-processing loan for genuine emergency situations requiring immediate financial assistance. Streamlined application process with minimal documentation requirements for faster approval and disbursement.",
    eligible: true,
    type: "Emergency",
    icon: HelpCircle,
    minAmount: 1000,
    maxAmount: 70000,
    maxAmountNotes: "depending on years of membership",
    minEquityRequired: 10000,
    minTenureMonths: 24, // Based on 2 years fixed term
    interestRate: "7%",
    interestRateTypeDescription:
      "per annum, calculated based on the diminishing principal balance",
    minTermDescription: "2 years (fixed)",
    maxTermDescription: "2 years (fixed)",
    termOptions: ["2 years"],
    validationRulesNotes: "Refer to Key Emergency Loan Conditions",
    otherConditionsNotes:
      "Refer to Key Emergency Loan Conditions. Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      sssNumber: false,
      tinNumber: false,
      schoolIdFront: false,
      schoolIdBack: false,
      govIdFront: false,
      govIdBack: false,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: true,
  },
  {
    id: "el4",
    name: "Car Loan",
    description: "Finance your new or used car purchase.",
    detailedDescription:
      "Specialized automotive financing for members looking to purchase new or used vehicles. Competitive rates with flexible payment terms. Requires vehicle documentation and comprehensive financial assessment.",
    eligible: true,
    type: "Car",
    icon: Car,
    minAmount: 1000,
    maxAmount: 1000000,
    maxAmountNotes: "",
    minEquityRequired: 100000,
    minTenureMonths: 120, // Based on minimum 10 years of membership
    interestRate: "8%",
    interestRateTypeDescription: "add on rate per annum",
    minTermDescription: "6 years (fixed)",
    maxTermDescription: "6 years (fixed)",
    termOptions: ["6 years"],
    validationRulesNotes: "Minimum 10 years of membership.",
    otherConditionsNotes:
      "Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      officeVisitRequired: true,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: false,
    contactOfficeMessage:
      "Car loan applications require in-person consultation at the Retirement Office for vehicle assessment and documentation review.",
  },
  {
    id: "el5",
    name: "Motorcycle Loan",
    description: "Get funding for a new motorcycle.",
    detailedDescription:
      "Affordable financing solution for motorcycle purchases. Whether for transportation needs or leisure, this loan offers reasonable terms for two-wheel vehicle acquisition with simplified processing.",
    eligible: true,
    type: "Motorcycle",
    icon: Bike,
    minAmount: 1000,
    maxAmount: 150000,
    maxAmountNotes: "",
    minEquityRequired: 40000,
    minTenureMonths: 120, // Based on minimum 10 years of membership
    interestRate: "8%",
    interestRateTypeDescription: "add on rate per annum",
    minTermDescription: "3 years (fixed)",
    maxTermDescription: "3 years (fixed)",
    termOptions: ["3 years"],
    validationRulesNotes: "Minimum 10 years of membership.",
    otherConditionsNotes:
      "Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      officeVisitRequired: true,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: false,
    contactOfficeMessage:
      "Motorcycle loan applications require in-person consultation at the Retirement Office for vehicle assessment and documentation review.",
  },
  {
    id: "el6",
    name: "Short Term Loan",
    description: "Quick loan for immediate, short-duration financial gaps.",
    detailedDescription:
      "Fast-processing loan for immediate financial needs with short repayment periods. Ideal for bridging temporary cash flow gaps or covering urgent expenses that can be quickly repaid.",
    eligible: true,
    type: "ShortTerm",
    icon: Clock,
    minAmount: 5000,
    maxAmount: 5000,
    maxAmountNotes: "",
    minEquityRequired: 5000,
    minTenureMonths: 36, // Based on minimum 3 years of membership
    interestRate: "2%",
    interestRateTypeDescription: "add on rate per month",
    minTermDescription: "3 months (fixed)",
    maxTermDescription: "3 months (fixed)",
    termOptions: ["3 months"],
    validationRulesNotes:
      "Minimum 3 years of membership. Refer to Key Short Term Loan Conditions",
    otherConditionsNotes:
      "Proposed amounts input must be in denominations of 1000s.",
    applicationRequirements: {
      sssNumber: false,
      tinNumber: false,
      schoolIdFront: false,
      schoolIdBack: false,
      govIdFront: false,
      govIdBack: false,
      proposedAmount: true,
      reason: true,
      signature: true,
    },
    eligibilityMessage: "",
    canApplyOnline: true,
  },
];

const mockSubmittedApplications = [
  {
    id: "app1",
    userId: "user1",
    type: "Special Loan",
    submissionDate: "2024-03-01",
    status: "Pending Review",
    proposedAmount: 75000,
    approvedAmount: null,
    adminNotes: "Awaiting additional employment verification documents.",
    statusHistory: [
      {
        date: "2024-03-01",
        status: "Submitted",
        note: "Application received and initial review started.",
      },
      {
        date: "2024-03-05",
        status: "Under Review",
        note: "Application assigned to loan officer for detailed evaluation.",
      },
      {
        date: "2024-03-10",
        status: "Pending Review",
        note: "Additional documents requested from applicant.",
      },
    ],
    requirements: [
      {
        item: "Employment Certificate",
        status: "Submitted",
        date: "2024-03-01",
      },
      { item: "Income Statement", status: "Pending", date: null },
      { item: "Valid ID", status: "Submitted", date: "2024-03-01" },
    ],
  },
  {
    id: "app2",
    userId: "user1",
    type: "Regular Loan",
    submissionDate: "2024-02-15",
    status: "Approved",
    proposedAmount: 50000,
    approvedAmount: 45000,
    adminNotes:
      "Application approved with adjusted amount based on equity assessment.",
    statusHistory: [
      {
        date: "2024-02-15",
        status: "Submitted",
        note: "Application received and initial review started.",
      },
      {
        date: "2024-02-18",
        status: "Under Review",
        note: "Documents verified, equity calculation in progress.",
      },
      {
        date: "2024-02-22",
        status: "Approved",
        note: "Application approved with minor amount adjustment.",
      },
      {
        date: "2024-02-25",
        status: "Funds Released",
        note: "Loan amount disbursed to member account.",
      },
    ],
    requirements: [
      {
        item: "Employment Certificate",
        status: "Submitted",
        date: "2024-02-15",
      },
      { item: "Income Statement", status: "Submitted", date: "2024-02-15" },
      { item: "Valid ID", status: "Submitted", date: "2024-02-15" },
    ],
    releaseDate: "2024-02-25",
  },
  {
    id: "app3",
    userId: "user1",
    type: "Emergency Loan",
    submissionDate: "2024-01-10",
    status: "Rejected",
    proposedAmount: 25000,
    approvedAmount: 0,
    adminNotes:
      "Application rejected due to insufficient equity balance and existing loan obligations.",
    statusHistory: [
      {
        date: "2024-01-10",
        status: "Submitted",
        note: "Emergency loan application received.",
      },
      {
        date: "2024-01-12",
        status: "Under Review",
        note: "Equity and existing loan balance assessment in progress.",
      },
      {
        date: "2024-01-15",
        status: "Rejected",
        note: "Insufficient available equity after existing loan deductions.",
      },
    ],
    requirements: [
      {
        item: "Emergency Justification Letter",
        status: "Submitted",
        date: "2024-01-10",
      },
      { item: "Valid ID", status: "Submitted", date: "2024-01-10" },
    ],
  },
];

const mockNotifications = [
  {
    id: "notif1",
    title: "Loan Approved!",
    snippet: "Your Regular Loan (RL2023-001) has been approved.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif2",
    title: "Payment Reminder",
    snippet: "Your next loan payment for EL2024-005 is due on 2024-05-15.",
    timestamp: "1 day ago",
    read: true,
  },
];

const mockFaqs = [
  {
    id: "faq1",
    question: "How do I apply for a loan?",
    answer:
      'You can apply for a loan through the "Apply Loan" section in the app. Select the loan type you are interested in and fill out the application form.',
  },
  {
    id: "faq2",
    question: "What are the eligibility requirements?",
    answer: "Eligibility requirements vary... (details as before)",
  },
];

// --- New UI Helper Components for PIN Screens ---
const PinInputDisplay = ({ pinLength, currentPin }) => {
  const displayChars = [];
  for (let i = 0; i < pinLength; i++) {
    displayChars.push(
      <div
        key={`pin-char-${i}`}
        className={`w-10 h-10 border-2 rounded-lg mx-1 flex items-center justify-center transition-all duration-200 ease-in-out
          ${
            i < currentPin.length
              ? "bg-blue-500 border-blue-500"
              : "bg-gray-100 border-gray-300"
          }`}
      >
        {/* Visual cue for entered digit (optional, could be a dot) */}
        {i < currentPin.length && (
          <div className="w-3 h-3 bg-white rounded-full"></div>
        )}
      </div>
    );
  }
  return <div className="flex justify-center my-6">{displayChars}</div>;
};

const Numpad = ({ onKeyPress, onBackspace, disabled = false }) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "DEL"];

  const handlePress = (key) => {
    if (disabled || key === "") return;
    if (key === "DEL") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4 max-w-xs mx-auto">
      {keys.map((key, index) => (
        <button
          key={`numpad-${key}-${index}`}
          onClick={() => handlePress(key)}
          disabled={disabled || key === ""}
          className={`py-4 text-2xl font-semibold rounded-lg transition-colors focus:outline-none shadow-sm
            ${key === "" ? "opacity-0 cursor-default" : ""}
            ${
              disabled && key !== ""
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : key !== ""
                ? "bg-white hover:bg-gray-100 text-gray-700 active:bg-gray-200 border border-gray-300"
                : ""
            }
            ${key === "DEL" ? "text-red-500 hover:bg-red-50" : ""}
          `}
        >
          {key === "DEL" ? <ChevronLeft size={28} className="mx-auto" /> : key}
        </button>
      ))}
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [userLoginEmail, setUserLoginEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showLoanPaymentsModal, setShowLoanPaymentsModal] = useState(false);
  const [selectedLoanToApply, setSelectedLoanToApply] = useState(null);
  const [selectedLoanForDetails, setSelectedLoanForDetails] = useState(null); // New state for loan details
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isNewUserFlow, setIsNewUserFlow] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockedOutEmail, setLockedOutEmail] = useState("");

  const navigate = (screen) => {
    if (currentScreen === "loginPin" && screen === "login") {
      if (
        currentUser?.cpuEmail === lockedOutEmail ||
        userLoginEmail === lockedOutEmail
      ) {
        setLoginAttempts(0);
        setIsLockedOut(false);
        setLockedOutEmail("");
      }
    }
    setCurrentScreen(screen);
    setErrorMessage("");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserData = localStorage.getItem("currentUserData");
    if (storedIsLoggedIn === "true" && storedUserData) {
      const parsedUser = JSON.parse(storedUserData);

      // Defensive update: Add netPay if missing (for existing logged-in users)
      if (!parsedUser.netPay) {
        parsedUser.netPay = parsedUser.id === "user1" ? 25000 : 15000;
        // Update localStorage with the new field
        localStorage.setItem("currentUserData", JSON.stringify(parsedUser));
      }

      setCurrentUser(parsedUser);
      setIsLoggedIn(true);
      // Always go to home since we removed profile completion flow
      navigate("home");
    }
  }, []);

  const handleLoginAttempt = (email) => {
    setLoginAttempts(0);
    setIsLockedOut(false);
    setLockedOutEmail("");

    setUserLoginEmail(email);
    const newUserId = `new${Date.now()}`;
    if (email.toLowerCase() === "newuser@cpu.edu.ph") {
      setIsNewUserFlow(true);
      const newUser = {
        ...newMockUserBaseTemplate,
        cpuEmail: email,
        id: newUserId,
      };
      setCurrentUser(newUser);
      navigate("createPin");
    } else if (email.toLowerCase() === defaultMockUser.cpuEmail.toLowerCase()) {
      setIsNewUserFlow(false);
      setCurrentUser(defaultMockUser);
      navigate("loginPin");
    } else {
      setErrorMessage(
        "Email not recognized. Try user@cpu.edu.ph or newuser@cpu.edu.ph"
      );
    }
  };

  const handlePinSet = (pin) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, hasPin: true, pin: pin };
    setCurrentUser(updatedUser);

    // Auto-generate system data for new users and proceed directly to home
    if (isNewUserFlow) {
      const systemSetData = {
        dateOfMembership: new Date().toISOString().split("T")[0],
        fsClassification:
          updatedUser.department === "College of Engineering"
            ? "Faculty"
            : "Staff",
        dateHired: new Date(
          new Date().setFullYear(new Date().getFullYear() - 1)
        )
          .toISOString()
          .split("T")[0],
      };

      const fullyUpdatedUser = {
        ...updatedUser,
        ...systemSetData,
        profileComplete: true,
      };

      setCurrentUser(fullyUpdatedUser);

      // Update equity record for new user
      const newEquity = mockEquities.find(
        (eq) => eq.id === "eq_new_user_placeholder"
      );
      if (newEquity) {
        newEquity.userId = fullyUpdatedUser.id;
        newEquity.startDate = new Date().toISOString().split("T")[0];
      }

      setIsNewUserFlow(false);
      handleLoginSuccess(fullyUpdatedUser);
    } else {
      handleLoginSuccess(updatedUser);
    }
  };

  const handleLoginSuccess = (userToLogin = currentUser) => {
    if (!userToLogin) return;
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUserData", JSON.stringify(userToLogin));
    setLoginAttempts(0);
    setIsLockedOut(false);
    setLockedOutEmail("");
    setErrorMessage("");

    // Always navigate to home since profile completion is no longer needed
    navigate("home");
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    if (newAttempts >= 3) {
      setIsLockedOut(true);
      const currentAttemptEmail = currentUser?.cpuEmail || userLoginEmail;
      setLockedOutEmail(currentAttemptEmail);
      setErrorMessage(
        "Too many incorrect PIN attempts. For your security, access has been temporarily locked. Please visit the Retirement Office to unlock your account."
      );
    } else {
      setErrorMessage(`Invalid PIN. ${3 - newAttempts} attempts remaining.`);
    }
  };

  const handleProfileComplete = (filledProfileData) => {
    const systemSetData = isNewUserFlow
      ? {
          dateOfMembership: new Date().toISOString().split("T")[0],
          fsClassification:
            filledProfileData.department === "College of Engineering"
              ? "Faculty"
              : "Staff",
          dateHired: new Date(
            new Date().setFullYear(
              new Date().getFullYear() -
                (filledProfileData.cpuld === "CPU-NEW001" ? 2 : 1)
            )
          )
            .toISOString()
            .split("T")[0],
        }
      : {};

    const fullyUpdatedUser = {
      ...currentUser,
      ...filledProfileData,
      ...systemSetData,
      profileComplete: true,
    };
    setCurrentUser(fullyUpdatedUser);

    if (isNewUserFlow) {
      const newEquity = mockEquities.find(
        (eq) => eq.id === "eq_new_user_placeholder"
      );
      if (newEquity) {
        newEquity.userId = fullyUpdatedUser.id;
        newEquity.startDate = new Date().toISOString().split("T")[0];
      }
    }
    setIsNewUserFlow(false);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUserData", JSON.stringify(fullyUpdatedUser));
    navigate("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsNewUserFlow(false);
    setUserLoginEmail("");
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUserData");
    setLoginAttempts(0);
    setIsLockedOut(false);
    setLockedOutEmail("");
    setErrorMessage("");
    navigate("login");
  };

  const renderScreen = () => {
    if (
      !isLoggedIn &&
      !["login", "loginPin", "createPin", "userFillInfo"].includes(
        currentScreen
      )
    ) {
      return (
        <LoginScreen
          navigate={navigate}
          handleLoginAttempt={handleLoginAttempt}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
        />
      );
    }
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            navigate={navigate}
            handleLoginAttempt={handleLoginAttempt}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        );
      case "loginPin":
        const isCurrentEmailLockedOut =
          isLockedOut &&
          (currentUser?.cpuEmail || userLoginEmail) === lockedOutEmail;
        return (
          <LoginPinScreen
            navigate={navigate}
            userEmailForDisplay={currentUser?.cpuEmail || userLoginEmail}
            storedPin={currentUser?.pin}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            onLoginSuccess={handleLoginSuccess}
            onLoginFail={handleFailedLogin}
            isLockedOut={isCurrentEmailLockedOut}
            appPinLength={APP_PIN_LENGTH}
          />
        );
      case "createPin":
        return (
          <CreatePinScreen
            navigate={navigate}
            userEmailForDisplay={currentUser?.cpuEmail || userLoginEmail}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            onPinSet={handlePinSet}
            appPinLength={APP_PIN_LENGTH}
          />
        );
      case "userFillInfo":
        // DEPRECATED: This screen is no longer part of the normal user flow
        // Profile data is now pre-populated and managed by the system
        // This case is kept for development/testing purposes only
        return (
          <UserFillInfoScreen
            navigate={navigate}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            prefilledData={currentUser}
            onProfileComplete={handleProfileComplete}
          />
        );
      case "home":
        return (
          <HomeScreen
            navigate={navigate}
            setSelectedLoan={setSelectedLoan}
            currentUser={currentUser}
          />
        );
      case "equity":
        return (
          <EquityScreen
            navigate={navigate}
            currentUser={currentUser}
            userEquities={mockEquities.filter(
              (eq) => eq.userId === currentUser?.id
            )}
          />
        );
      case "loans":
        return <LoansScreen navigate={navigate} currentUser={currentUser} />;
      case "activeLoan":
        return (
          <ActiveLoanScreen
            navigate={navigate}
            loan={selectedLoan}
            setShowLoanPaymentsModal={setShowLoanPaymentsModal}
          />
        );
      case "loanApplications":
        return (
          <LoanApplicationsScreen
            navigate={navigate}
            setSelectedLoanToApply={setSelectedLoanToApply}
            setSelectedLoanForDetails={setSelectedLoanForDetails}
            currentUser={currentUser}
            mockEquities={mockEquities}
          />
        );
      case "loanDetails":
        const currentEquity =
          mockEquities.find((eq) => eq.userId === currentUser?.id)
            ?.endingBalance?.total || 0;
        return (
          <LoanDetailsScreen
            navigate={navigate}
            loan={selectedLoanForDetails}
            currentUser={currentUser}
            currentEquity={currentEquity}
            onApply={(loan) => {
              const eligibilityCheck = checkLoanEligibility(
                loan,
                currentUser,
                currentEquity
              );
              if (eligibilityCheck.eligible) {
                setSelectedLoanToApply({
                  ...loan,
                  userMaxLoanable: currentEquity,
                });
                navigate("loanApplicationForm");
              }
            }}
          />
        );
      case "loanApplicationForm":
        return (
          <LoanApplicationFormScreen
            navigate={navigate}
            loanType={selectedLoanToApply}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        );
      case "loanApplicationStatus":
        return <LoanApplicationStatusScreen navigate={navigate} />;
      case "help":
        return <HelpScreen navigate={navigate} />;
      case "profile":
        return (
          <ProfileScreen
            navigate={navigate}
            currentUser={currentUser}
            userEquities={mockEquities.filter(
              (eq) => eq.userId === currentUser?.id
            )}
          />
        );
      case "notifications":
        return <NotificationsScreen navigate={navigate} />;
      case "settings":
        return (
          <SettingsScreen navigate={navigate} handleLogout={handleLogout} />
        );
      case "faq":
        return <FAQScreen navigate={navigate} />;
      case "feedback":
        return (
          <FeedbackScreen
            navigate={navigate}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        );
      default:
        return (
          <LoginScreen
            navigate={navigate}
            handleLoginAttempt={handleLoginAttempt}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        );
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col items-center">
      <div
        className="w-full max-w-md bg-white shadow-lg flex flex-col"
        style={{ minHeight: "100vh" }}
      >
        {/* Removed p-0 from main, screens will handle their own padding */}
        <main className="flex-grow overflow-y-auto flex flex-col">
          {renderScreen()}
        </main>
        {isLoggedIn &&
          ["home", "equity", "loans", "help", "profile"].includes(
            currentScreen
          ) && (
            <BottomNavBar currentScreen={currentScreen} navigate={navigate} />
          )}
        {showLoanPaymentsModal && selectedLoan && (
          <LoanPaymentsModal
            loan={selectedLoan}
            onClose={() => setShowLoanPaymentsModal(false)}
          />
        )}
      </div>
    </div>
  );
}

// --- Screen Components (Updated where necessary) ---

// 1. Login Screen (Initial View)
function LoginScreen({
  navigate,
  handleLoginAttempt,
  setErrorMessage,
  errorMessage,
}) {
  const [emailInput, setEmailInput] = useState("");
  const handleContinue = () => {
    if (!emailInput.trim() || !emailInput.includes("@cpu.edu.ph")) {
      setErrorMessage("Please enter a valid CPU email.");
      return;
    }
    setErrorMessage("");
    handleLoginAttempt(emailInput);
  };
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-6 py-8 bg-gray-50">
      {" "}
      {/* Changed bg to gray-50 for slight contrast */}
      <img
        src="https://i.imgur.com/JHyS3Qp.png"
        alt="CPU RPO Logo"
        className="w-28 h-28 mb-6"
      />
      <h1 className="text-2xl text-center font-bold text-blue-700 mb-2">
        {APP_NAME}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Retirement planning, simplified.
      </p>
      <div className="w-full p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Account
        </h2>
        <input
          type="email"
          placeholder="CPU Email (e.g., user@cpu.edu.ph)"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </p>
        )}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// 2. Login Screen (PIN Entry View) - Reverted to Light Theme
function LoginPinScreen({
  navigate,
  userEmailForDisplay,
  storedPin,
  errorMessage,
  setErrorMessage,
  onLoginSuccess,
  onLoginFail,
  isLockedOut,
  appPinLength,
}) {
  const [pinInput, setPinInput] = useState("");

  const handleNumpadPress = (key) => {
    if (isLockedOut) return;
    if (pinInput.length < appPinLength) {
      setPinInput(pinInput + key);
    }
  };

  const handleBackspace = () => {
    if (isLockedOut) return;
    setPinInput(pinInput.slice(0, -1));
  };

  useEffect(() => {
    if (errorMessage && pinInput.length > 0) {
      // Consider clearing pinInput if a global error (like lockout) is displayed
      // setPinInput("");
    }
  }, [errorMessage]);

  useEffect(() => {
    if (pinInput.length === appPinLength && !isLockedOut) {
      if (pinInput === storedPin) {
        setErrorMessage("");
        onLoginSuccess();
      } else {
        onLoginFail();
        setPinInput("");
      }
    }
  }, [
    pinInput,
    storedPin,
    onLoginSuccess,
    onLoginFail,
    appPinLength,
    isLockedOut,
    setErrorMessage,
  ]);

  return (
    <div className="flex flex-col justify-between flex-grow bg-gray-50 p-6">
      <div className="text-center">
        <div className="relative flex items-center justify-center mb-4 pt-4">
          <button
            onClick={() => navigate("login")}
            className="absolute left-0 text-blue-600 hover:text-blue-800 p-2 disabled:opacity-50"
            aria-label="Go back to login"
            disabled={isLockedOut}
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src="https://i.imgur.com/JHyS3Qp.png"
            alt="App Logo"
            className="w-16 h-16"
          />
        </div>
        <h1 className="text-2xl font-bold text-blue-700 mt-4">{APP_NAME}</h1>
        <p className="text-sm text-gray-500 mt-4">
          Logging in as:{" "}
          <span className="font-medium text-gray-700">
            {userEmailForDisplay}
          </span>
        </p>
        <button
          onClick={() => navigate("login")}
          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
          disabled={isLockedOut}
        >
          Change Email
        </button>

        <p className="text-lg font-medium text-gray-700 mt-8 mb-2">
          Enter your PIN
        </p>
        <p className="text-xs text-gray-500 mb-4 px-6">
          <Bell size={14} className="inline mr-1 text-gray-400" /> Never share
          your PIN with anyone.
        </p>

        <PinInputDisplay pinLength={appPinLength} currentPin={pinInput} />

        {errorMessage && (
          <p
            className={`text-sm mt-2 mb-4 px-6 text-center ${
              isLockedOut ? "text-red-600 font-semibold" : "text-red-500"
            }`}
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div className="w-full pb-4">
        <Numpad
          onKeyPress={handleNumpadPress}
          onBackspace={handleBackspace}
          disabled={
            isLockedOut || (pinInput.length >= appPinLength && !isLockedOut)
          }
        />
        <button
          onClick={() => {
            if (isLockedOut) return;
            alert(
              "Forgot PIN: Please contact the Retirement Office for assistance."
            );
          }}
          className="text-sm text-blue-600 hover:underline text-center w-full mt-6 disabled:opacity-50"
          disabled={isLockedOut}
        >
          Forgot PIN?
        </button>
      </div>
    </div>
  );
}

// 3. Create PIN Screen - Reverted to Light Theme
function CreatePinScreen({
  navigate,
  userEmailForDisplay,
  setErrorMessage,
  errorMessage,
  onPinSet,
  appPinLength,
}) {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentStage, setCurrentStage] = useState("new");

  const handleNumpadPress = (key) => {
    if (currentStage === "new") {
      if (newPin.length < appPinLength) setNewPin(newPin + key);
    } else {
      if (confirmPin.length < appPinLength) setConfirmPin(confirmPin + key);
    }
  };

  const handleBackspace = () => {
    if (currentStage === "new") {
      setNewPin(newPin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  useEffect(() => {
    if (currentStage === "new" && newPin.length === appPinLength) {
      setCurrentStage("confirm");
      setErrorMessage("");
    }
  }, [newPin, appPinLength, currentStage, setErrorMessage]);

  const validateAndSetPin = useCallback(() => {
    // Added useCallback
    if (newPin !== confirmPin) {
      setErrorMessage("PINs do not match. Please try again.");
      setNewPin("");
      setConfirmPin("");
      setCurrentStage("new");
      return false;
    }
    if (newPin.length !== appPinLength) {
      setErrorMessage(`PIN must be ${appPinLength} digits long.`);
      return false;
    }
    setErrorMessage("");
    return true;
  }, [newPin, confirmPin, appPinLength, setErrorMessage]); // Added dependencies

  useEffect(() => {
    if (currentStage === "confirm" && confirmPin.length === appPinLength) {
      if (validateAndSetPin()) {
        onPinSet(newPin);
      }
    }
  }, [
    confirmPin,
    appPinLength,
    currentStage,
    newPin,
    onPinSet,
    validateAndSetPin,
  ]); // Added newPin and validateAndSetPin

  return (
    <div className="flex flex-col justify-between flex-grow bg-gray-50 p-6">
      <div className="text-center">
        <div className="relative flex items-center justify-center mb-4 pt-4">
          <button
            onClick={() => navigate("login")}
            className="absolute left-0 text-blue-600 hover:text-blue-800 p-2"
            aria-label="Go back"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src="https://i.imgur.com/JHyS3Qp.png"
            alt="App Logo"
            className="w-16 h-16"
          />
        </div>
        <h1 className="text-2xl font-bold text-blue-700 mt-4">{APP_NAME}</h1>

        <p className="text-sm text-gray-500 mt-4">
          Setting PIN for:{" "}
          <span className="font-medium text-gray-700">
            {userEmailForDisplay}
          </span>
        </p>

        <p className="text-lg font-medium text-gray-700 mt-8 mb-2">
          {currentStage === "new" ? "Create your PIN" : "Confirm your PIN"}
        </p>
        <p className="text-xs text-gray-500 mb-4 px-6">
          <Bell size={14} className="inline mr-1 text-gray-400" /> Set a{" "}
          {appPinLength}-digit PIN for secure access.
        </p>

        <PinInputDisplay
          pinLength={appPinLength}
          currentPin={currentStage === "new" ? newPin : confirmPin}
        />

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 mb-4 px-6 text-center">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="w-full pb-4">
        <Numpad
          onKeyPress={handleNumpadPress}
          onBackspace={handleBackspace}
          disabled={
            (currentStage === "new" && newPin.length >= appPinLength) ||
            (currentStage === "confirm" && confirmPin.length >= appPinLength)
          }
        />
      </div>
    </div>
  );
}

// 4. User Fill Info Screen
function UserFillInfoScreen({
  navigate,
  setErrorMessage,
  errorMessage,
  prefilledData,
  onProfileComplete,
}) {
  const [cpuld, setCpuld] = useState(prefilledData?.cpuld || "");
  const [surname, setSurname] = useState(prefilledData?.surname || "");
  const [firstname, setFirstname] = useState(prefilledData?.firstname || "");
  const [middlename, setMiddlename] = useState(prefilledData?.middlename || "");
  const [birthdate, setBirthdate] = useState(prefilledData?.birthdate || "");
  const [civilStatus, setCivilStatus] = useState(
    prefilledData?.civilStatus || ""
  );
  const [sex, setSex] = useState(prefilledData?.sex || "");
  const [department, setDepartment] = useState(prefilledData?.department || "");
  const [contactNumber, setContactNumber] = useState(
    prefilledData?.contactNumber || ""
  );

  const handleSaveAndContinue = () => {
    if (
      !surname.trim() ||
      !firstname.trim() ||
      !department.trim() ||
      !contactNumber.trim() ||
      !birthdate ||
      !civilStatus ||
      !sex
    ) {
      setErrorMessage("Please fill/confirm all mandatory fields.");
      return;
    }
    setErrorMessage("");
    const filledProfileData = {
      cpuld,
      surname,
      firstname,
      middlename,
      birthdate,
      civilStatus,
      sex,
      department,
      contactNumber,
    };
    onProfileComplete(filledProfileData);
  };

  return (
    <div className="px-4 pt-6 pb-4 flex-grow w-full bg-gray-50 flex flex-col">
      <PageHeader
        title="Confirm/Complete Profile"
        onBack={() =>
          navigate(
            prefilledData?.hasPin
              ? prefilledData.pin
                ? "loginPin"
                : "createPin"
              : "login"
          )
        }
      />
      <div className="flex-grow overflow-y-auto">
        <p className="text-gray-600 mb-1 text-center">
          Account:{" "}
          <span className="font-medium">{prefilledData?.cpuEmail}</span>
        </p>
        <p className="text-gray-600 mb-6 text-center">
          Please confirm or complete your information below.
        </p>
        <div className="w-full p-6 bg-white rounded-xl shadow-lg space-y-4 ">
          <InputField
            label="CPU ID (cpuld)"
            value={cpuld}
            onChange={setCpuld}
            placeholder="e.g., 12-3456-78"
            isReadOnly={!!prefilledData?.cpuld}
          />
          <InputField
            label="Surname"
            value={surname}
            onChange={setSurname}
            placeholder="e.g., Dela Cruz"
            isReadOnly={!!prefilledData?.surname}
          />
          <InputField
            label="First Name"
            value={firstname}
            onChange={setFirstname}
            placeholder="e.g., Juan"
            isReadOnly={!!prefilledData?.firstname}
          />
          <InputField
            label="Middle Name (Optional)"
            value={middlename}
            onChange={setMiddlename}
            placeholder="e.g., Ponce"
          />
          <InputField
            label="Birth Date"
            type="date"
            value={birthdate}
            onChange={setBirthdate}
          />
          <SelectField
            label="Civil Status"
            value={civilStatus}
            onChange={setCivilStatus}
            options={["", "Single", "Married", "Widowed", "Separated"]}
          />
          <SelectField
            label="Sex"
            value={sex}
            onChange={setSex}
            options={["", "Male", "Female", "Prefer not to say"]}
          />
          <InputField
            label="Department"
            value={department}
            onChange={setDepartment}
            placeholder="e.g., College of Engineering"
            isReadOnly={!!prefilledData?.department}
          />
          <InputField
            label="Contact Number"
            type="tel"
            value={contactNumber}
            onChange={(val) => setContactNumber(val.replace(/\D/g, ""))}
            placeholder="e.g., 09123456789"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <button
            onClick={handleSaveAndContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200 mt-4 shadow-md hover:shadow-lg"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper InputField
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  isReadOnly = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => !isReadOnly && onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={isReadOnly}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);
// Helper SelectField
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} disabled={opt === ""}>
          {opt === "" ? `Select ${label}` : opt}
        </option>
      ))}
    </select>
  </div>
);

// 5. Home Screen
function HomeScreen({ navigate, setSelectedLoan, currentUser }) {
  const hasPendingApplication = mockSubmittedApplications.some(
    (app) => app.status === "Pending Review"
  );
  const pendingApplication = mockSubmittedApplications.find(
    (app) => app.status === "Pending Review"
  );
  const displayName = currentUser?.firstname || "User";

  const handleSeeDetails = (loan) => {
    setSelectedLoan(loan);
    navigate("activeLoan");
  };

  return (
    <div className="p-6 flex-grow bg-gray-50">
      {/* Header with Notifications and Settings icons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome,</h1>
          <h2 className="text-2xl font-semibold text-blue-600">
            {displayName}!
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notifications Icon */}
          <button
            onClick={() => navigate("notifications")}
            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={24} strokeWidth={2} />
            {/* Notification badge if there are unread notifications */}
            {mockNotifications.some((notif) => !notif.read) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => navigate("settings")}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {hasPendingApplication && pendingApplication && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md mb-6"
          role="alert"
        >
          <div className="flex items-center">
            <Bell size={20} className="mr-3 text-yellow-600" />
            <div>
              <p className="font-bold">Pending Loan Application</p>
              <p className="text-sm">
                {pendingApplication.type} - {pendingApplication.status}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("loanApplicationStatus")}
            className="mt-3 text-sm text-yellow-800 hover:underline font-semibold"
          >
            View Status
          </button>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Active Loans
        </h2>
        {mockActiveLoans.filter((l) => l.userId === currentUser?.id).length >
        0 ? (
          <div className="space-y-4">
            {mockActiveLoans
              .filter((l) => l.userId === currentUser?.id)
              .map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {loan.loanTypeDetail} ({loan.loanCode})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Outstanding:{" "}
                    <span className="font-medium text-gray-800">
                      ₱{loan.outstandingLoan?.toLocaleString()}
                    </span>{" "}
                    (as of {loan.outstandingLoanDate})
                  </p>
                  <p className="text-sm text-gray-600">
                    Repayment:{" "}
                    <span className="font-medium text-gray-800">
                      ₱{loan.repaymentAmount?.toLocaleString()}
                    </span>
                  </p>
                  <button
                    onClick={() => handleSeeDetails(loan)}
                    className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm shadow-md hover:shadow-lg"
                  >
                    See Details
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg border">
            <FileText size={56} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-1 text-lg">No Active Loans</p>
            <p className="text-gray-500 mb-6 text-sm">
              You don't have any active loans at the moment.
            </p>
            <button
              onClick={() => navigate("loanApplications")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Apply for a loan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 6. Active Loan Screen
function ActiveLoanScreen({ navigate, loan, setShowLoanPaymentsModal }) {
  if (!loan)
    return (
      <div className="text-center p-8 flex-grow bg-gray-50">
        <p className="text-red-500">No loan selected.</p>
        <button
          onClick={() => navigate("home")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  const principal = loan.pnAmount || loan.amountGranted;
  const term = loan.numYearsToPay
    ? `${loan.numYearsToPay} Years`
    : loan.numOfTerms
    ? `${loan.numOfTerms} Terms`
    : "N/A";
  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="Loan Details" onBack={() => navigate("home")} />
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-700 mb-1">
          {loan.loanTypeDetail}
        </h2>
        <p className="text-sm text-gray-500 mb-6">Loan Code: {loan.loanCode}</p>
        <InfoRow
          label="Principal Amount"
          value={principal ? `₱${principal.toLocaleString()}` : "N/A"}
        />
        <InfoRow
          label="Outstanding Balance"
          value={`₱${loan.outstandingLoan?.toLocaleString()}`}
          isEmphasized={true}
        />
        <InfoRow label="Date Applied" value={loan.dateApplied} />
        <InfoRow label="Date Released" value={loan.dateReleased || "N/A"} />
        <InfoRow label="Maturity Date" value={loan.maturityDate || "N/A"} />
        <InfoRow label="Loan Term" value={term} />
        <InfoRow label="Interest Rate" value={loan.interestRate || "N/A"} />
        <InfoRow
          label="Monthly Deduction Amount"
          value={
            loan.repaymentAmount
              ? `₱${loan.repaymentAmount.toLocaleString()}`
              : "N/A"
          }
        />
        <InfoRow label="Outstanding As Of" value={loan.outstandingLoanDate} />

        {/* Information about automatic deductions */}
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDays size={20} className="text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Payment Method:</strong> Loan payments are automatically
                deducted from your salary. The schedule below shows completed
                and projected payments.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLoanPaymentsModal(true)}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          View Loan Payments
        </button>
      </div>
    </div>
  );
}
const InfoRow = ({ label, value, isEmphasized = false }) => (
  <div
    className={`flex justify-between py-3 border-b border-gray-100 ${
      isEmphasized ? "text-lg" : "text-sm"
    }`}
  >
    <span className="text-gray-600">{label}:</span>
    <span
      className={`font-medium ${
        isEmphasized ? "text-green-600 font-bold" : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

// 7. Loan Payments Modal (formerly Loan Breakdown Modal)
function LoanPaymentsModal({ loan, onClose }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredPayments, setFilteredPayments] = useState(mockLoanBreakdown);

  // Predefined filter options for mobile-friendly experience
  const filterOptions = [
    { key: "all", label: "All Payments", icon: "📋" },
    { key: "completed", label: "Completed Only", icon: "✅" },
    { key: "projected", label: "Projected Only", icon: "🔮" },
    { key: "last3months", label: "Last 3 Months", icon: "📅" },
    { key: "thisYear", label: "This Year", icon: "🗓️" },
    { key: "nextYear", label: "Next Year", icon: "⏭️" },
  ];

  // Filter payments based on selected option
  useEffect(() => {
    let filtered = mockLoanBreakdown;
    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );
    const currentYear = now.getFullYear();

    switch (selectedFilter) {
      case "completed":
        filtered = mockLoanBreakdown.filter((p) => !p.isProjected);
        break;
      case "projected":
        filtered = mockLoanBreakdown.filter((p) => p.isProjected);
        break;
      case "last3months":
        filtered = mockLoanBreakdown.filter((p) => {
          const paymentDate = new Date(p.paymentDate);
          return (
            paymentDate >= threeMonthsAgo &&
            paymentDate <= now &&
            !p.isProjected
          );
        });
        break;
      case "thisYear":
        filtered = mockLoanBreakdown.filter((p) => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate.getFullYear() === currentYear;
        });
        break;
      case "nextYear":
        filtered = mockLoanBreakdown.filter((p) => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate.getFullYear() === currentYear + 1;
        });
        break;
      default:
        filtered = mockLoanBreakdown;
    }

    setFilteredPayments(filtered);
  }, [selectedFilter]);

  const completedPayments = filteredPayments.filter((p) => !p.isProjected);
  const projectedPayments = filteredPayments.filter((p) => p.isProjected);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center z-50">
      <div className="bg-white w-full max-h-[95vh] flex flex-col rounded-t-2xl">
        {/* Mobile-optimized header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              Payment Schedule
            </h2>
            <p className="text-sm text-gray-600">{loan.loanCode}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Auto-deduction info */}
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <CalendarDays size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Automatic Deductions
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Payments are automatically deducted from your salary. Schedule
                  shows completed and projected payments.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-friendly filter buttons */}
          <div className="p-4 bg-white border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Filter Payments
            </p>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedFilter(option.key)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === option.key
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
            {selectedFilter !== "all" && (
              <p className="text-xs text-gray-600 mt-2 text-center">
                Showing {filteredPayments.length} of {mockLoanBreakdown.length}{" "}
                payments
              </p>
            )}
          </div>

          {/* Mobile-optimized payment list */}
          <div className="p-4">
            {filteredPayments.length > 0 ? (
              <div className="space-y-3">
                {filteredPayments.map((payment, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      payment.isProjected
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    {/* Payment header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.paymentDate}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            payment.isProjected
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {payment.isProjected
                            ? "🔮 Projected"
                            : "✅ Completed"}
                        </span>
                      </div>
                    </div>

                    {/* Payment details grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-600 mb-1">
                          Principal Amortization
                        </p>
                        <p className="font-semibold text-blue-600">
                          ₱{payment.principalAmortization.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-600 mb-1">
                          Interest Paid
                        </p>
                        <p className="font-semibold text-green-600">
                          ₱{payment.interestPaid.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2 bg-white p-2 rounded border">
                        <p className="text-xs text-gray-600 mb-1">
                          Remaining Balance
                        </p>
                        <p className="font-bold text-gray-800">
                          ₱{payment.remainingBalance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600 mb-1">No payments found</p>
                <p className="text-sm text-gray-500">
                  Try a different filter option
                </p>
              </div>
            )}
          </div>

          {/* Summary stats for mobile */}
          {filteredPayments.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-lg font-bold text-blue-600">
                    {completedPayments.length}
                  </p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-lg font-bold text-yellow-600">
                    {projectedPayments.length}
                  </p>
                  <p className="text-xs text-gray-600">Projected</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-lg font-bold text-gray-800">
                    {filteredPayments.length}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-optimized close button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
          >
            Close Payment Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. Loan Applications Screen
function LoanApplicationsScreen({
  navigate,
  setSelectedLoanToApply,
  setSelectedLoanForDetails,
  currentUser,
  mockEquities,
}) {
  const handleViewDetails = (loan) => {
    setSelectedLoanForDetails(loan);
    navigate("loanDetails");
  };

  let maxLoanableAmount = 0;
  let userHasEquityRecord = false;
  let currentEquity = 0;

  if (currentUser && mockEquities) {
    const userEquities = mockEquities.filter(
      (eq) => eq.userId === currentUser.id && eq.startDate
    );
    if (userEquities.length > 0) {
      userHasEquityRecord = true;
      userEquities.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      const currentEquityRecord = userEquities[0];
      currentEquity =
        currentEquityRecord.endingBalance?.total ||
        currentEquityRecord.endingEquity ||
        0;

      const userActiveLoans = mockActiveLoans.filter(
        (loan) => loan.userId === currentUser.id
      );
      const totalOutstandingLoanAmount = userActiveLoans.reduce(
        (sum, loan) => sum + loan.outstandingLoan,
        0
      );
      maxLoanableAmount = currentEquity - totalOutstandingLoanAmount;
      if (maxLoanableAmount < 0) maxLoanableAmount = 0;
    }
  }

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="Loan Options" onBack={() => navigate("home")} />

      {/* Universal Financial Overview - Shows Available Equity for All Loan Types */}
      {currentUser && (
        <div
          className={`p-4 rounded-xl shadow-md mb-6 border-l-4 ${
            userHasEquityRecord
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-yellow-50 border-yellow-500 text-yellow-700"
          }`}
        >
          <p className="font-bold text-lg">Your Financial Overview:</p>
          {userHasEquityRecord ? (
            <>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm font-medium">Total Equity:</p>
                  <p className="font-semibold text-lg">
                    ₱{currentEquity.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Outstanding Loans:</p>
                  <p className="font-semibold text-lg">
                    ₱{(currentEquity - maxLoanableAmount).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                <p className="text-sm font-medium">Available for New Loans:</p>
                <p className="font-bold text-xl text-green-600">
                  ₱{maxLoanableAmount.toLocaleString()}
                </p>
                <p className="text-xs mt-1">
                  Available amount is your total equity minus outstanding loan
                  balances.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm mt-1">
              Your equity information is not yet available. Loan applications
              may be limited.
            </p>
          )}
        </div>
      )}

      {/* Loan Options */}
      <div className="space-y-4">
        {sortLoansByDisplayOrder(mockEligibleLoans).map((loan) => {
          const IconComponent = loan.icon || FileText;
          const eligibilityCheck = checkLoanEligibility(
            loan,
            currentUser,
            currentEquity
          );
          const isEligible = eligibilityCheck.eligible;

          return (
            <div
              key={loan.id}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-200"
            >
              {/* Loan Header */}
              <div className="flex items-center mb-3">
                <IconComponent
                  size={28}
                  className="mr-3 text-blue-500 shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {loan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {loan.description}
                  </p>
                </div>
                {/* Eligibility Badge */}
                <div className="shrink-0 ml-2">
                  {isEligible ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle size={16} className="mr-1" />
                      <span className="text-xs font-medium">Eligible</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      <XCircle size={16} className="mr-1" />
                      <span className="text-xs font-medium">Not Eligible</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount Range</p>
                  <p className="font-medium">
                    ₱{loan.minAmount.toLocaleString()} - ₱
                    {loan.maxAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate}</p>
                </div>
              </div>

              {/* Eligibility Message */}
              {!isEligible && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Eligibility Requirement:</strong>{" "}
                    {eligibilityCheck.reason}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleViewDetails(loan)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-md hover:shadow-lg"
                >
                  View Details
                </button>

                {loan.canApplyOnline && isEligible && (
                  <button
                    onClick={() => {
                      setSelectedLoanToApply({
                        ...loan,
                        userMaxLoanable: maxLoanableAmount,
                      });
                      navigate("loanApplicationForm");
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center mb-2">
          <HelpCircle size={20} className="text-gray-500 mr-2" />
          <h3 className="font-semibold text-gray-700">Need Help?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Not sure which loan is right for you? Our Retirement Office staff can
          help you choose the best option.
        </p>
        <button
          onClick={() =>
            alert(
              "Contact Information:\n\nRetirement Plan Office\nEmail: rpo@cpu.edu.ph\nPhone: (033) 329-1971\nOffice Hours: Monday-Friday, 8:00 AM - 5:00 PM"
            )
          }
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
        >
          Contact Retirement Office
        </button>
      </div>
    </div>
  );
}

// --- File Upload Components ---
const FileUploadComponent = ({
  label,
  fileName,
  onFileChange,
  required = false,
  accept = "image/*",
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleClearFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center">
          {!fileName ? (
            <>
              <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1"
                >
                  <span>Choose file</span>
                  <input
                    ref={fileInputRef}
                    id={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    name={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    type="file"
                    className="sr-only"
                    accept={accept}
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {fileName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Enhanced Input Components ---
const FormInputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Specialized Amount Input Component for Loan Applications
const AmountInputField = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  minAmount,
  maxAmount,
}) => {
  const formatNumberWithCommas = (num) => {
    if (!num) return "";
    return Number(num).toLocaleString();
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Remove any non-numeric characters
    inputValue = inputValue.replace(/[^\d]/g, "");

    // Convert to number
    const numValue = Number(inputValue);

    // Update the parent component with the raw number
    onChange(numValue);
  };

  const handleBlur = () => {
    // When user leaves the field, round to nearest 1000 if it's not already
    if (value && !validateAmountDenomination(value)) {
      const rounded = Math.round(Number(value) / 1000) * 1000;
      if (rounded > 0) {
        onChange(rounded);
      }
    }
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const getStepValue = () => {
    return 1000; // Always step by 1000
  };

  const getFormattedValue = () => {
    if (value === "" || value === null || value === undefined) return "";
    // For number inputs, we need to return the raw number, not formatted
    return value;
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₱</span>
        </div>
        <input
          type="number"
          value={getFormattedValue()}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          step={getStepValue()}
          min={minAmount}
          max={maxAmount}
          className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      <div className="mt-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Amount must be in thousands (₱1,000, ₱2,000, etc.)
          </p>
          {value && !validateAmountDenomination(value) && (
            <p className="text-xs text-orange-500">
              Will round to ₱{Math.round(Number(value) / 1000) * 1000}
            </p>
          )}
        </div>
        {minAmount && maxAmount && (
          <p className="text-xs text-gray-400">
            Range: ₱{minAmount.toLocaleString()} - ₱{maxAmount.toLocaleString()}
          </p>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const FormTextArea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 3,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// --- Enhanced Loan Application Form Screen ---
function LoanApplicationFormScreen({
  navigate,
  loanType,
  setErrorMessage,
  errorMessage,
}) {
  // Form state
  const [formData, setFormData] = useState({
    sssNumber: "",
    tinNumber: "",
    proposedAmount: "",
    reason: "",
    signature: "",
  });

  // File state for ID uploads
  const [files, setFiles] = useState({
    schoolIdFront: null,
    schoolIdBack: null,
    govIdFront: null,
    govIdBack: null,
  });

  // Error state
  const [errors, setErrors] = useState({});

  if (!loanType) {
    return (
      <div className="text-center p-8 flex-grow bg-gray-50">
        <p className="text-red-500">No loan type selected.</p>
        <button
          onClick={() => navigate("loanApplications")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Back to Loan Options
        </button>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (fileType, file) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }));
    // Clear error when file is selected
    if (errors[fileType]) {
      setErrors((prev) => ({ ...prev, [fileType]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.proposedAmount || formData.proposedAmount <= 0) {
      newErrors.proposedAmount = "Please enter a valid proposed amount";
    } else {
      const amount = parseFloat(formData.proposedAmount);

      // UNIVERSAL validation for ALL loan types using new architecture
      // Get current user's equity for validation
      const currentUserEquity =
        mockEquities.find((eq) => eq.userId === "user1")?.endingBalance
          ?.total || 0;

      // Use enhanced eligibility check with proposed amount (works for all loan types)
      const eligibilityResult = checkLoanEligibility(
        loanType,
        defaultMockUser,
        currentUserEquity,
        amount
      );

      if (!eligibilityResult.eligible) {
        newErrors.proposedAmount = eligibilityResult.reason;
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for the loan";
    }

    if (!formData.signature) {
      newErrors.signature = "Digital signature is required";
    }

    // Loan-type specific validations
    const requirements = loanType.applicationRequirements;

    if (requirements.sssNumber && !formData.sssNumber.trim()) {
      newErrors.sssNumber = "SSS Number is required";
    }

    if (requirements.tinNumber && !formData.tinNumber.trim()) {
      newErrors.tinNumber = "TIN Number is required";
    }

    if (requirements.schoolIdFront && !files.schoolIdFront) {
      newErrors.schoolIdFront = "School ID (Front) is required";
    }

    if (requirements.schoolIdBack && !files.schoolIdBack) {
      newErrors.schoolIdBack = "School ID (Back) is required";
    }

    if (requirements.govIdFront && !files.govIdFront) {
      newErrors.govIdFront = "Government ID (Front) is required";
    }

    if (requirements.govIdBack && !files.govIdBack) {
      newErrors.govIdBack = "Government ID (Back) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setErrorMessage("Please fix the errors below before submitting.");
      return;
    }

    setErrorMessage("");

    // Create application object
    const newApplication = {
      id: `app${Date.now()}`,
      userId: "user1", // This would be dynamic in real app
      type: loanType.name,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Pending Review",
      proposedAmount: parseFloat(formData.proposedAmount),
      approvedAmount: null,
      adminNotes: "Awaiting initial assessment.",
      statusHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          status: "Submitted",
          note: "Application received and initial review started.",
        },
      ],
      requirements: generateRequirementsList(),
      formData: { ...formData },
      files: { ...files },
    };

    // Add to mock applications (in real app, this would be an API call)
    mockSubmittedApplications.unshift(newApplication);

    // Show success message
    alert(
      `${loanType.name} application submitted successfully for ₱${parseFloat(
        formData.proposedAmount
      ).toLocaleString()}!`
    );

    // Navigate to application status
    navigate("loanApplicationStatus");
  };

  const generateRequirementsList = () => {
    const requirements = [];
    const reqs = loanType.applicationRequirements;

    if (reqs.sssNumber)
      requirements.push({
        item: "SSS Number",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    if (reqs.tinNumber)
      requirements.push({
        item: "TIN Number",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    if (reqs.schoolIdFront)
      requirements.push({
        item: "School ID (Front)",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    if (reqs.schoolIdBack)
      requirements.push({
        item: "School ID (Back)",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    if (reqs.govIdFront)
      requirements.push({
        item: "Government ID (Front)",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    if (reqs.govIdBack)
      requirements.push({
        item: "Government ID (Back)",
        status: "Submitted",
        date: new Date().toISOString().split("T")[0],
      });
    requirements.push({
      item: "Proposed Amount & Reason",
      status: "Submitted",
      date: new Date().toISOString().split("T")[0],
    });
    requirements.push({
      item: "Digital Signature",
      status: "Submitted",
      date: new Date().toISOString().split("T")[0],
    });

    return requirements;
  };

  const requirements = loanType.applicationRequirements;

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader
        title={`${loanType.name} Application`}
        onBack={() => navigate("loanApplications")}
      />

      {/* Loan Type Info */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-lg">
        <div className="flex items-center mb-2">
          <loanType.icon size={20} className="mr-2 text-blue-600" />
          <h3 className="font-semibold">{loanType.name}</h3>
        </div>
        <p className="text-sm">{loanType.description}</p>
        <div className="mt-2 text-xs">
          <span className="font-medium">Amount Range:</span> ₱
          {loanType.minAmount.toLocaleString()} - ₱
          {loanType.maxAmount.toLocaleString()} |
          <span className="font-medium ml-2">Interest Rate:</span>{" "}
          {loanType.interestRate}
        </div>

        {/* Regular Loan Specific Information */}
        {loanType.type === "Regular" && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium">Interest Details:</span>{" "}
                {loanType.interestRateTypeDescription}
              </div>
              <div>
                <span className="font-medium">Repayment Method:</span>{" "}
                Semi-monthly through payroll deduction
              </div>
              <div>
                <span className="font-medium">Service Fee:</span> ₱200.00
                (deducted from loan proceeds)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Universal Dynamic Eligibility Display - Works for ALL Loan Types */}
      {(() => {
        const currentUserEquity =
          mockEquities.find((eq) => eq.userId === "user1")?.endingBalance
            ?.total || 0;
        const eligibilityResult = checkLoanEligibility(
          loanType,
          defaultMockUser,
          currentUserEquity
        );

        return (
          eligibilityResult.eligible && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
              <h4 className="font-semibold mb-2">
                Your {loanType.name} Eligibility
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Your Tenure:</span>{" "}
                  {eligibilityResult.tenureMonths} months
                </p>
                <p>
                  <span className="font-medium">Your Total Equity:</span> ₱
                  {eligibilityResult.totalEquity?.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Outstanding Loans:</span> ₱
                  {eligibilityResult.outstandingLoans?.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Available Equity:</span>{" "}
                  <span className="text-green-600 font-bold">
                    ₱{eligibilityResult.availableEquity?.toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Maximum Loanable Amount:</span>{" "}
                  <span className="text-blue-600 font-bold">
                    ₱{eligibilityResult.dynamicMaxLoanable?.toLocaleString()}
                  </span>
                </p>
                {eligibilityResult.dynamicMaxYearsPayment && (
                  <p>
                    <span className="font-medium">Maximum Payment Term:</span>{" "}
                    {eligibilityResult.dynamicMaxYearsPayment} years (
                    {eligibilityResult.dynamicMaxPaymentMonths} months)
                  </p>
                )}
                {eligibilityResult.serviceFee && (
                  <p>
                    <span className="font-medium">Service Fee:</span> ₱
                    {eligibilityResult.serviceFee.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )
        );
      })()}

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
        {/* 1. Proposed Amount - All loan types */}
        <AmountInputField
          label="Proposed Amount"
          value={formData.proposedAmount}
          onChange={(value) => handleInputChange("proposedAmount", value)}
          placeholder="Enter amount (e.g., 15000)"
          required={true}
          error={errors.proposedAmount}
          minAmount={loanType.minAmount}
          maxAmount={loanType.maxAmount}
        />

        {/* 2. Reason for Loan - All loan types */}
        <FormTextArea
          label="Reason for Loan"
          value={formData.reason}
          onChange={(value) => handleInputChange("reason", value)}
          placeholder="Please provide a detailed reason for this loan request..."
          required={true}
          error={errors.reason}
          rows={4}
        />

        {/* 3. Document Uploads Section (if required) */}
        {(requirements.sssNumber ||
          requirements.tinNumber ||
          requirements.schoolIdFront ||
          requirements.govIdFront) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Required Documents
            </h3>
            <div className="space-y-4">
              {/* SSS Number - Only for Regular Loans */}
              {requirements.sssNumber && (
                <FormInputField
                  label="SSS Number"
                  value={formData.sssNumber}
                  onChange={(value) => handleInputChange("sssNumber", value)}
                  placeholder="XX-XXXXXXX-X"
                  required={true}
                  error={errors.sssNumber}
                />
              )}

              {/* TIN Number - Only for Regular Loans */}
              {requirements.tinNumber && (
                <FormInputField
                  label="TIN Number"
                  value={formData.tinNumber}
                  onChange={(value) => handleInputChange("tinNumber", value)}
                  placeholder="XXX-XXX-XXX-XXX"
                  required={true}
                  error={errors.tinNumber}
                />
              )}

              {/* ID Upload Section */}
              {(requirements.schoolIdFront || requirements.govIdFront) && (
                <div className="grid grid-cols-1 gap-4">
                  {requirements.schoolIdFront && (
                    <FileUploadComponent
                      label="School ID (Front)"
                      fileName={files.schoolIdFront?.name}
                      onFileChange={(file) =>
                        handleFileChange("schoolIdFront", file)
                      }
                      required={true}
                    />
                  )}

                  {requirements.schoolIdBack && (
                    <FileUploadComponent
                      label="School ID (Back)"
                      fileName={files.schoolIdBack?.name}
                      onFileChange={(file) =>
                        handleFileChange("schoolIdBack", file)
                      }
                      required={true}
                    />
                  )}

                  {requirements.govIdFront && (
                    <FileUploadComponent
                      label="Government ID (Front)"
                      fileName={files.govIdFront?.name}
                      onFileChange={(file) =>
                        handleFileChange("govIdFront", file)
                      }
                      required={true}
                    />
                  )}

                  {requirements.govIdBack && (
                    <FileUploadComponent
                      label="Government ID (Back)"
                      fileName={files.govIdBack?.name}
                      onFileChange={(file) =>
                        handleFileChange("govIdBack", file)
                      }
                      required={true}
                    />
                  )}
                </div>
              )}
            </div>
            {(errors.sssNumber ||
              errors.tinNumber ||
              errors.schoolIdFront ||
              errors.schoolIdBack ||
              errors.govIdFront ||
              errors.govIdBack) && (
              <p className="text-red-500 text-sm mt-2">
                Please complete all required document fields
              </p>
            )}
          </div>
        )}

        {/* 4. Digital Signature - All loan types */}
        <div>
          <SignatureCapture
            signature={formData.signature}
            onSignatureChange={(signature) =>
              handleInputChange("signature", signature)
            }
          />
          {errors.signature && (
            <p className="text-red-500 text-xs mt-1">{errors.signature}</p>
          )}
        </div>

        {/* Regular Loan Additional Information */}
        {loanType.type === "Regular" && (
          <div className="space-y-4">
            {/* Consideration of Other Loans */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-yellow-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">
                    Important Notice
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Please note: Your outstanding loans with SSS, Pag-ibig, and
                    other accounts with the University will be considered in the
                    final loan determination.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <h5 className="font-medium text-gray-700 mb-1">
                  Loan Restructuring
                </h5>
                <p>
                  Conditions apply for restructuring this loan. Contact the
                  office for details.
                </p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <h5 className="font-medium text-gray-700 mb-1">
                  Early Pre-termination
                </h5>
                <p>
                  A fee may apply for early full settlement. Contact the office
                  for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Agreement Checkbox */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreement"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            required
          />
          <label htmlFor="agreement" className="ml-2 text-sm text-gray-700">
            I acknowledge that all information provided is true and accurate. I
            understand the terms and conditions of this loan application and
            agree to the repayment schedule upon approval.
            <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          Submit {loanType.name} Application
        </button>
      </div>
    </div>
  );
}

// --- Common Components ---
function BottomNavBar({ currentScreen, navigate }) {
  const navItems = [
    { name: "Home", screen: "home", icon: Home },
    { name: "Equity", screen: "equity", icon: TrendingUp },
    { name: "Loans", screen: "loans", icon: FileText },
    { name: "Help", screen: "help", icon: HelpCircle },
    { name: "Profile", screen: "profile", icon: User },
  ];
  return (
    <nav className="sticky bottom-0 w-full max-w-md bg-white border-t border-gray-200 shadow-t-lg">
      <div className="flex justify-around items-center h-18 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg w-1/5 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              } transition-colors`}
              aria-label={item.name}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={`text-xs mt-1 text-center leading-tight ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
                style={{ fontSize: "10px", lineHeight: "12px" }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const PageHeader = ({ title, onBack }) => (
  <div className="flex items-center mb-8 relative h-10 px-0">
    {onBack && (
      <button
        onClick={onBack}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 p-2 -ml-2 z-10"
      >
        <ChevronLeft size={30} />
      </button>
    )}
    <h1 className="w-full text-xl font-semibold text-gray-800 text-center">
      {title}
    </h1>
  </div>
);

// Loans Hub Screen
function LoansScreen({ navigate, currentUser }) {
  const userActiveLoans = mockActiveLoans.filter(
    (loan) => loan.userId === currentUser?.id
  );
  const userApplications = mockSubmittedApplications.filter(
    (app) => app.userId === currentUser?.id || app.userId === undefined
  );
  const hasPendingApplications = userApplications.some(
    (app) => app.status === "Pending Review"
  );

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loans</h1>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-center">
          <Briefcase size={32} className="mx-auto text-blue-500 mb-2" />
          <p className="text-lg font-bold text-gray-800">
            {userActiveLoans.length}
          </p>
          <p className="text-sm text-gray-600">Active Loans</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-center">
          <FileText size={32} className="mx-auto text-green-500 mb-2" />
          <p className="text-lg font-bold text-gray-800">
            {userApplications.length}
          </p>
          <p className="text-sm text-gray-600">Applications</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="space-y-4">
        {/* Apply for a Loan */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Apply For A Loan
              </h3>
              <p className="text-sm text-gray-600">
                Submit a new loan application
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("loanApplications")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Start New Application
          </button>
        </div>

        {/* View Loan Applications Status */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Search size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  My Loan Applications
                </h3>
                <p className="text-sm text-gray-600">
                  Track your application status and history
                </p>
              </div>
            </div>
            {hasPendingApplications && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {userApplications.length > 0 ? (
            <>
              {/* Quick status preview */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Recent:</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      userApplications[0].status === "Pending Review"
                        ? "bg-yellow-100 text-yellow-800"
                        : userApplications[0].status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userApplications[0].status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {userApplications[0].type} -{" "}
                  {userApplications[0].submissionDate}
                </p>
              </div>
              <button
                onClick={() => navigate("loanApplicationStatus")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
              >
                View All Applications ({userApplications.length})
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-4">
                No applications submitted yet.
              </p>
              <button
                onClick={() => navigate("loanApplications")}
                className="w-full bg-gray-300 text-gray-600 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                disabled
              >
                No Applications to View
              </button>
            </>
          )}
        </div>

        {/* Active Loans Quick Access */}
        {userActiveLoans.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Active Loans
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your current loan details
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {userActiveLoans.slice(0, 2).map((loan) => (
                <div
                  key={loan.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium">
                    {loan.loanTypeDetail}
                  </span>
                  <span className="text-sm text-gray-600">
                    ₱{loan.outstandingLoan?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("home")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              View All Active Loans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Missing Screen Components ---

// 6. Equity Screen - Detailed Equity Statement
function EquityScreen({ navigate, currentUser, userEquities }) {
  if (!currentUser) {
    return (
      <div className="p-6 text-center flex-grow bg-gray-50">
        Loading profile...
      </div>
    );
  }

  // Get the latest equity statement
  const latestEquity =
    userEquities && userEquities.length > 0
      ? userEquities
          .filter((eq) => eq.statementPeriod?.startDate)
          .sort(
            (a, b) =>
              new Date(b.statementPeriod.endDate) -
              new Date(a.statementPeriod.endDate)
          )[0]
      : null;

  if (!latestEquity || !latestEquity.statementPeriod?.startDate) {
    return (
      <div className="p-6 flex-grow bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Detailed Equity Statement
          </h1>
        </div>
        <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg border">
          <TrendingUp size={56} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-1 text-lg">
            No Equity Statement Available
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Your detailed equity statement is not yet available. Please contact
            the Retirement Plan Office for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Detailed Equity Statement
        </h1>
      </div>

      {/* Statement Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Employee No.</p>
            <p className="font-semibold text-gray-800">
              {latestEquity.employeeNo}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Employee Name</p>
            <p className="font-semibold text-gray-800">
              {latestEquity.employeeName}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 font-semibold text-center">
            Statement Period: {latestEquity.statementPeriod.startDate} to{" "}
            {latestEquity.statementPeriod.endDate}
          </p>
          <p className="text-blue-600 text-sm text-center mt-1">
            As of {latestEquity.statementPeriod.asOfDate}
          </p>
        </div>
      </div>

      {/* Total Ending Equity */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white mb-6">
        <div className="text-center">
          <p className="text-blue-100 text-sm mb-2">Total Ending Equity</p>
          <p className="text-4xl font-bold">
            ₱{latestEquity.endingBalance.total.toLocaleString()}
          </p>
          <p className="text-blue-100 text-xs mt-2">
            Sum of all ending balance components
          </p>
        </div>
      </div>
    </div>
  );
}

// 11. Profile Screen
function ProfileScreen({ navigate, currentUser, userEquities }) {
  if (!currentUser)
    return (
      <div className="p-6 text-center flex-grow bg-gray-50">
        Loading profile...
      </div>
    );

  const getInitials = (first, last) =>
    `${first ? first.charAt(0) : ""}${
      last ? last.charAt(0) : ""
    }`.toUpperCase() || "U";

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="My Profile" onBack={() => navigate("home")} />
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-5 shrink-0 shadow-md">
            {getInitials(currentUser.firstname, currentUser.surname)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 break-all">
              {currentUser.firstname}{" "}
              {currentUser.middlename ? `${currentUser.middlename} ` : ""}
              {currentUser.surname}
            </h2>
            <p className="text-sm text-gray-500 break-all">
              {currentUser.cpuEmail}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ProfileInfoItem
            icon={<User size={18} className="mr-2.5 text-blue-500" />}
            label="CPU ID"
            value={currentUser.cpuld}
          />
          <ProfileInfoItem
            icon={<Briefcase size={18} className="mr-2.5 text-blue-500" />}
            label="Department"
            value={currentUser.department}
          />
          <ProfileInfoItem
            icon={<CalendarDays size={18} className="mr-2.5 text-blue-500" />}
            label="Birth Date"
            value={currentUser.birthdate}
          />
        </div>
      </div>

      {/* Equity Statement Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            My Equity Statement
          </h3>
          <TrendingUp size={24} className="text-blue-500" />
        </div>
        <button
          onClick={() => navigate("equity")}
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          <FileText size={18} className="mr-2" /> View Detailed Equity Statement
        </button>
      </div>
    </div>
  );
}

const ProfileInfoItem = ({ icon, label, value, isSystemData }) => (
  <div className="py-3.5 border-b border-gray-100 flex items-center">
    <div className="shrink-0 w-6 flex justify-center">{icon}</div>
    <div className="ml-3">
      <p
        className={`text-xs ${
          isSystemData ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label} {isSystemData ? "(System managed)" : ""}
      </p>
      <p className="text-md font-medium text-gray-800 break-all">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

// 12. Notifications Screen
function NotificationsScreen({ navigate }) {
  const [notificationsData, setNotificationsData] = useState(mockNotifications);
  const toggleReadStatus = (id) => {
    setNotificationsData(
      notificationsData.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };
  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="Notifications" onBack={() => navigate("home")} />
      {notificationsData.length > 0 ? (
        <div className="space-y-4">
          {notificationsData.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl shadow-lg border-l-4 ${
                notif.read
                  ? "bg-white border-gray-300"
                  : "bg-blue-50 border-blue-500"
              } transition-all duration-200`}
              onClick={() => toggleReadStatus(notif.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-start">
                <div
                  className={`mr-4 mt-1 shrink-0 ${
                    notif.read ? "text-gray-400" : "text-blue-500"
                  }`}
                >
                  {notif.title.includes("Approved") ? (
                    <CheckCircle size={22} />
                  ) : notif.title.includes("Reminder") ? (
                    <Bell size={22} />
                  ) : (
                    <MessageSquare size={22} />
                  )}
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold text-lg ${
                      notif.read ? "text-gray-700" : "text-blue-700"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      notif.read ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {notif.snippet}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {notif.timestamp}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-center ml-3 shrink-0 animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg border">
          <Bell size={56} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-1 text-lg">No Notifications</p>
          <p className="text-gray-500 mb-6 text-sm">
            You currently have no new notifications.
          </p>
        </div>
      )}
    </div>
  );
}

// 13. Settings Screen
function SettingsScreen({ navigate, handleLogout }) {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);
  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="Settings" onBack={() => navigate("home")} />
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-200">
        <SettingsSection title="Notification Preferences">
          <SwitchItem
            label="Enable Push Notifications"
            enabled={pushNotificationsEnabled}
            setEnabled={setPushNotificationsEnabled}
          />
        </SettingsSection>
        <SettingsSection title="Account">
          <SettingsItem
            label="Change PIN"
            onClick={() =>
              alert(
                "Change PIN: For security, please contact the Retirement Office."
              )
            }
          />
        </SettingsSection>
        <SettingsSection title="Support">
          <SettingsItem label="FAQ" onClick={() => navigate("faq")} />
          <SettingsItem
            label="Help Us Improve"
            onClick={() => navigate("feedback")}
          />
        </SettingsSection>
        <div className="p-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const SettingsSection = ({ title, children }) => (
  <div className="p-5">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3.5">
      {title}
    </h3>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const SettingsItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center w-full py-3.5 text-left text-gray-700 hover:bg-gray-100 rounded-lg px-3 transition-colors"
  >
    <span className="text-md">{label}</span>
    <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
  </button>
);

const SwitchItem = ({ label, enabled, setEnabled }) => (
  <div className="flex justify-between items-center py-3.5 px-3">
    <span className="text-gray-700 text-md">{label}</span>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      <span className="sr-only">Enable</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </button>
  </div>
);

// 14. Help Screen
function HelpScreen({ navigate }) {
  return (
    <div className="p-6 flex-grow bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help</h1>
      </div>

      <div className="space-y-4">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Contact Us
              </h3>
              <p className="text-sm text-gray-600">
                Get in touch with our office
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Office:</strong> Retirement Plan Office
            </p>
            <p>
              <strong>Email:</strong> rpo@cpu.edu.ph
            </p>
            <p>
              <strong>Phone:</strong> (033) 329-1971
            </p>
            <p>
              <strong>Hours:</strong> Monday-Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
        </div>

        {/* Quick Help */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <HelpCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Quick Help
              </h3>
              <p className="text-sm text-gray-600">
                Common questions and answers
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("faq")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
          >
            View FAQ
          </button>
        </div>

        {/* Feedback */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Star size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Share Feedback
              </h3>
              <p className="text-sm text-gray-600">
                Help us improve our services
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("feedback")}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

// 15. FAQ Screen
function FAQScreen({ navigate }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader
        title="Frequently Asked Questions"
        onBack={() => navigate("help")}
      />

      <div className="space-y-4">
        {mockFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-t-xl"
            >
              <h3 className="font-semibold text-gray-800">{faq.question}</h3>
              {expandedFaq === faq.id ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {expandedFaq === faq.id && (
              <div className="p-4 pt-0 border-t border-gray-100">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 16. Feedback Screen
function FeedbackScreen({ navigate, setErrorMessage, errorMessage }) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim() || rating === 0 || !category) {
      setErrorMessage("Please fill all fields and provide a rating.");
      return;
    }
    setErrorMessage("");
    alert("Thank you for your feedback! We appreciate your input.");
    navigate("help");
  };

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader title="Share Feedback" onBack={() => navigate("help")} />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="app">App Experience</option>
            <option value="loans">Loan Services</option>
            <option value="equity">Equity Information</option>
            <option value="general">General Service</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                <Star
                  size={32}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <FormTextArea
          label="Your Feedback"
          value={feedback}
          onChange={setFeedback}
          placeholder="Please share your thoughts, suggestions, or any issues you've encountered..."
          required={true}
          rows={6}
        />

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

// 17. Loan Application Status Screen
function LoanApplicationStatusScreen({ navigate }) {
  const userApplications = mockSubmittedApplications.filter(
    (app) => app.userId === "user1" || app.userId === undefined
  );

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader
        title="My Loan Applications"
        onBack={() => navigate("loans")}
      />

      {userApplications.length > 0 ? (
        <div className="space-y-4">
          {userApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-200"
            >
              {/* Application Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {app.type}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Applied: {app.submissionDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Pending Review"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Application Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Proposed Amount:</span>
                  <span className="font-medium">
                    ₱{app.proposedAmount.toLocaleString()}
                  </span>
                </div>
                {app.approvedAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Approved Amount:</span>
                    <span className="font-medium text-green-600">
                      ₱{app.approvedAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              {app.adminNotes && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> {app.adminNotes}
                  </p>
                </div>
              )}

              {/* Status History */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Application Timeline
                </h4>
                <div className="space-y-2">
                  {app.statusHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start text-xs"
                    >
                      <div>
                        <span className="font-medium">{history.status}</span>
                        <p className="text-gray-600 mt-1">{history.note}</p>
                      </div>
                      <span className="text-gray-500">{history.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg border">
          <FileText size={56} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-1 text-lg">No Applications</p>
          <p className="text-gray-500 mb-6 text-sm">
            You haven't submitted any loan applications yet.
          </p>
          <button
            onClick={() => navigate("loanApplications")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Apply for a Loan
          </button>
        </div>
      )}
    </div>
  );
}

// 18. Loan Details Screen
function LoanDetailsScreen({
  navigate,
  loan,
  currentUser,
  currentEquity,
  onApply,
}) {
  if (!loan) {
    return (
      <div className="text-center p-8 flex-grow bg-gray-50">
        <p className="text-red-500">No loan details available.</p>
        <button
          onClick={() => navigate("loanApplications")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Back to Loan Options
        </button>
      </div>
    );
  }

  const IconComponent = loan.icon || FileText;
  const eligibilityCheck = checkLoanEligibility(
    loan,
    currentUser,
    currentEquity
  );
  const isEligible = eligibilityCheck.eligible;

  return (
    <div className="p-6 flex-grow bg-gray-50">
      <PageHeader
        title="Loan Details"
        onBack={() => navigate("loanApplications")}
      />

      {/* Loan Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="flex items-center mb-4">
          <IconComponent size={32} className="mr-4 text-blue-500" />
          <div>
            <h2 className="text-2xl font-semibold text-blue-600">
              {loan.name}
            </h2>
            <p className="text-gray-600">{loan.description}</p>
          </div>
        </div>

        {/* Eligibility Status */}
        <div
          className={`p-3 rounded-lg mb-4 ${
            isEligible
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center">
            {isEligible ? (
              <CheckCircle size={20} className="text-green-600 mr-2" />
            ) : (
              <XCircle size={20} className="text-red-600 mr-2" />
            )}
            <span
              className={`font-medium ${
                isEligible ? "text-green-800" : "text-red-800"
              }`}
            >
              {isEligible
                ? "You are eligible for this loan"
                : "You are not eligible for this loan"}
            </span>
          </div>
          {!isEligible && (
            <p className="text-red-700 text-sm mt-2">
              {eligibilityCheck.reason}
            </p>
          )}
        </div>

        <p className="text-gray-700">{loan.detailedDescription}</p>
      </div>

      {/* Loan Information */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Loan Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <InfoRow
            label="Amount Range"
            value={`₱${loan.minAmount.toLocaleString()} - ₱${loan.maxAmount.toLocaleString()}`}
          />
          <InfoRow label="Interest Rate" value={loan.interestRate} />
          <InfoRow label="Term Options" value={loan.termOptions.join(", ")} />
          <InfoRow
            label="Minimum Equity Required"
            value={`₱${loan.minEquityRequired.toLocaleString()}`}
          />
          <InfoRow
            label="Minimum Tenure"
            value={`${loan.minTenureMonths} months`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {loan.canApplyOnline ? (
          <>
            {isEligible ? (
              <button
                onClick={() => onApply(loan)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
              >
                Apply for {loan.name}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
              >
                Application Not Available
              </button>
            )}
          </>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-2">
              <HelpCircle size={20} className="text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-800">
                Office Visit Required
              </span>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
              {loan.contactOfficeMessage}
            </p>
            <button
              onClick={() =>
                alert(
                  "Contact Information:\n\nRetirement Plan Office\nEmail: rpo@cpu.edu.ph\nPhone: (033) 329-1971\nOffice Hours: Monday-Friday, 8:00 AM - 5:00 PM"
                )
              }
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Contact Retirement Office
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 19. Signature Capture Component
function SignatureCapture({ signature, onSignatureChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 150;

    // Set drawing styles
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add placeholder text if no signature
    if (!hasSignature) {
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Sign here", canvas.width / 2, canvas.height / 2);
    }
  }, [hasSignature]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    // Clear placeholder text
    if (!hasSignature) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left || e.touches[0].clientX - rect.left,
      e.clientY - rect.top || e.touches[0].clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.lineTo(
      e.clientX - rect.left || e.touches[0].clientX - rect.left,
      e.clientY - rect.top || e.touches[0].clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Save signature as base64
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL();
    onSignatureChange(signatureData);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);
    setIsDrawing(false);
    onSignatureChange("");

    // Redraw placeholder
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sign here", canvas.width / 2, canvas.height / 2);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Digital Signature <span className="text-red-500">*</span>
      </label>
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full border border-gray-200 rounded cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-500">
            Sign above using your finger or mouse
          </p>
          <button
            type="button"
            onClick={clearSignature}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for loan eligibility
function calculateUserTenureMonths(currentUser) {
  if (!currentUser?.dateOfMembership) return 0;
  const membershipDate = new Date(currentUser.dateOfMembership);
  const currentDate = new Date();
  const monthsDiff =
    (currentDate.getFullYear() - membershipDate.getFullYear()) * 12 +
    (currentDate.getMonth() - membershipDate.getMonth());
  return Math.max(0, monthsDiff);
}

/**
 * Calculate Regular Loan maximum caps based on membership tenure
 * Based on official Regular Loan tenure-based limits table
 * @param {number} membershipMonths - Total months of membership
 * @returns {object} - { maxLoanable, maxYearsPayment, maxMonthsPayment }
 */
function getRegularLoanMaxCaps(membershipMonths) {
  // Convert months to handle year boundaries precisely
  const years = Math.floor(membershipMonths / 12);
  const remainingMonths = membershipMonths % 12;

  // A. 5-9 months
  if (membershipMonths >= 5 && membershipMonths < 10) {
    return { maxLoanable: 3000, maxYearsPayment: 1, maxMonthsPayment: 12 };
  }

  // B. 10-11 months
  if (membershipMonths >= 10 && membershipMonths < 12) {
    return { maxLoanable: 6000, maxYearsPayment: 2, maxMonthsPayment: 24 };
  }

  // C. 1 year but less than 11 years (12 months to 131 months)
  if (membershipMonths >= 12 && membershipMonths < 132) {
    // Detailed sub-brackets for 1-10 years
    if (years === 1)
      return { maxLoanable: 18000, maxYearsPayment: 3, maxMonthsPayment: 36 };
    if (years === 2)
      return { maxLoanable: 36000, maxYearsPayment: 3, maxMonthsPayment: 36 };
    if (years === 3)
      return { maxLoanable: 60000, maxYearsPayment: 4, maxMonthsPayment: 48 };
    if (years === 4)
      return { maxLoanable: 90000, maxYearsPayment: 4, maxMonthsPayment: 48 };
    if (years === 5)
      return { maxLoanable: 120000, maxYearsPayment: 4, maxMonthsPayment: 48 };
    if (years === 6)
      return { maxLoanable: 150000, maxYearsPayment: 5, maxMonthsPayment: 60 };
    if (years === 7)
      return { maxLoanable: 180000, maxYearsPayment: 5, maxMonthsPayment: 60 };
    if (years === 8)
      return { maxLoanable: 210000, maxYearsPayment: 5, maxMonthsPayment: 60 };
    if (years === 9)
      return { maxLoanable: 240000, maxYearsPayment: 5, maxMonthsPayment: 60 };
    if (years === 10)
      return { maxLoanable: 300000, maxYearsPayment: 5, maxMonthsPayment: 60 };
  }

  // D. 11-14 years (132 months to 179 months)
  if (membershipMonths >= 132 && membershipMonths < 180) {
    return { maxLoanable: 350000, maxYearsPayment: 5, maxMonthsPayment: 60 };
  }

  // E. 15-19 years (180 months to 239 months)
  if (membershipMonths >= 180 && membershipMonths < 240) {
    return { maxLoanable: 500000, maxYearsPayment: 5, maxMonthsPayment: 60 };
  }

  // F. 20+ years (240+ months)
  if (membershipMonths >= 240) {
    return { maxLoanable: 600000, maxYearsPayment: 6, maxMonthsPayment: 72 };
  }

  // Less than 5 months - not eligible
  return { maxLoanable: 0, maxYearsPayment: 0, maxMonthsPayment: 0 };
}

// Global amount validation function for denomination requirements
function validateAmountDenomination(amount) {
  // Convert to number if it's a string
  const numAmount = Number(amount);

  // Check if it's a valid positive number and divisible by 1000
  return !isNaN(numAmount) && numAmount > 0 && numAmount % 1000 === 0;
}

/**
 * Universal base loan eligibility validation for all loan types
 * Handles common checks like equity, outstanding loans, amount validation
 */
function validateBaseLoanEligibility(
  loan,
  currentUser,
  currentEquity,
  availableEquity,
  totalOutstanding,
  userTenure,
  proposedAmount = null
) {
  // 1. Check minimum equity requirement (applies to all loans)
  if (currentEquity < loan.minEquityRequired) {
    return {
      eligible: false,
      reason: `Minimum equity of ₱${loan.minEquityRequired.toLocaleString()} required. Your current equity: ₱${currentEquity.toLocaleString()}`,
      totalEquity: currentEquity,
      outstandingLoans: totalOutstanding,
      availableEquity: availableEquity,
    };
  }

  // 2. Check available equity after outstanding loans (universal)
  if (availableEquity <= 0) {
    return {
      eligible: false,
      reason: `No available equity for new loans. Your equity: ₱${currentEquity.toLocaleString()}, Outstanding loans: ₱${totalOutstanding.toLocaleString()}`,
      totalEquity: currentEquity,
      outstandingLoans: totalOutstanding,
      availableEquity: availableEquity,
    };
  }

  // 3. Check basic tenure requirement (if specified)
  if (loan.minTenureMonths && userTenure < loan.minTenureMonths) {
    return {
      eligible: false,
      reason: `Minimum ${loan.minTenureMonths} months of membership required. Your tenure: ${userTenure} months`,
      totalEquity: currentEquity,
      outstandingLoans: totalOutstanding,
      availableEquity: availableEquity,
    };
  }

  // 4. Validate proposed amount against available equity (universal)
  if (proposedAmount !== null) {
    if (!validateAmountDenomination(proposedAmount)) {
      return {
        eligible: false,
        reason: "Amount must be in thousands (₱1,000, ₱2,000, etc.)",
        totalEquity: currentEquity,
        outstandingLoans: totalOutstanding,
        availableEquity: availableEquity,
      };
    }

    if (proposedAmount > availableEquity) {
      return {
        eligible: false,
        reason: `Loan amount exceeds available equity. Available: ₱${availableEquity.toLocaleString()} (Total equity: ₱${currentEquity.toLocaleString()} - Outstanding loans: ₱${totalOutstanding.toLocaleString()})`,
        totalEquity: currentEquity,
        outstandingLoans: totalOutstanding,
        availableEquity: availableEquity,
      };
    }

    if (proposedAmount < loan.minAmount) {
      return {
        eligible: false,
        reason: `Minimum amount is ₱${loan.minAmount.toLocaleString()}`,
        totalEquity: currentEquity,
        outstandingLoans: totalOutstanding,
        availableEquity: availableEquity,
      };
    }

    if (proposedAmount > loan.maxAmount) {
      return {
        eligible: false,
        reason: `Maximum amount is ₱${loan.maxAmount.toLocaleString()}`,
        totalEquity: currentEquity,
        outstandingLoans: totalOutstanding,
        availableEquity: availableEquity,
      };
    }
  }

  // Base checks passed
  return {
    eligible: true,
    reason: "",
    totalEquity: currentEquity,
    outstandingLoans: totalOutstanding,
    availableEquity: availableEquity,
    tenureMonths: userTenure,
  };
}

function checkLoanEligibility(
  loan,
  currentUser,
  currentEquity,
  proposedAmount = null
) {
  if (!currentUser || currentEquity === undefined) {
    return { eligible: false, reason: "User information not available" };
  }

  const userTenure = calculateUserTenureMonths(currentUser);

  // UNIVERSAL: Calculate available equity by deducting outstanding loans (applies to ALL loan types)
  const userOutstandingLoans = mockActiveLoans.filter(
    (activeLoan) => activeLoan.userId === currentUser.id
  );
  const totalOutstanding = userOutstandingLoans.reduce(
    (sum, loan) => sum + (loan.outstandingLoan || 0),
    0
  );
  const availableEquity = currentEquity - totalOutstanding;

  // UNIVERSAL: Base equity and tenure validations for all loan types
  const baseEligibilityCheck = validateBaseLoanEligibility(
    loan,
    currentUser,
    currentEquity,
    availableEquity,
    totalOutstanding,
    userTenure,
    proposedAmount
  );

  if (!baseEligibilityCheck.eligible) {
    return baseEligibilityCheck;
  }

  // LOAN TYPE SPECIFIC VALIDATIONS
  // After base validations pass, apply loan-specific business rules

  if (loan.type === "Regular") {
    return validateRegularLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  if (loan.type === "Emergency") {
    return validateEmergencyLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  if (loan.type === "Special") {
    return validateSpecialLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  if (loan.type === "ShortTerm") {
    return validateShortTermLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  if (loan.type === "Car") {
    return validateCarLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  if (loan.type === "Motorcycle") {
    return validateMotorcycleLoanSpecific(
      baseEligibilityCheck,
      loan,
      currentUser,
      userTenure,
      availableEquity,
      proposedAmount
    );
  }

  // Fallback: return base eligibility with available equity calculation
  return {
    ...baseEligibilityCheck,
    dynamicMaxLoanable: Math.min(availableEquity, loan.maxAmount),
  };
}

/**
 * LOAN TYPE SPECIFIC VALIDATION FUNCTIONS
 * These functions handle the detailed business rules for each loan type
 * Future loan type configurations can be easily added here
 */

// Regular Loan specific validation (comprehensive implementation)
function validateRegularLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  const serviceFee = 200;

  // 1. Check minimum 5 months of contributions
  if (userTenure < 5) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Regular Loan requires minimum 5 months of contributions. Your tenure: ${userTenure} months`,
      serviceFee,
    };
  }

  // 2. Check net pay requirement (≥ ₱3,000)
  if (!currentUser.netPay || currentUser.netPay < 3000) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Net pay must be at least ₱3,000 per month. Your current net pay: ₱${
        currentUser.netPay?.toLocaleString() || "Not available"
      }`,
      serviceFee,
    };
  }

  // 3. Get tenure-based maximum caps
  const tenureCaps = getRegularLoanMaxCaps(userTenure);
  if (tenureCaps.maxLoanable === 0) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Insufficient tenure for Regular Loan. Minimum 5 months required.`,
      serviceFee,
    };
  }

  // 4. Validate proposed amount against tenure-based caps
  if (proposedAmount !== null && proposedAmount > tenureCaps.maxLoanable) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Based on your ${userTenure} months of tenure, maximum loanable amount is ₱${tenureCaps.maxLoanable.toLocaleString()}`,
      serviceFee,
    };
  }

  // Calculate effective maximum (lesser of available equity and tenure-based cap)
  const effectiveMaxLoanable = Math.min(
    availableEquity,
    tenureCaps.maxLoanable
  );

  return {
    ...baseCheck,
    eligible: true,
    dynamicMaxLoanable: effectiveMaxLoanable,
    dynamicMaxPaymentMonths: tenureCaps.maxMonthsPayment,
    dynamicMaxYearsPayment: tenureCaps.maxYearsPayment,
    serviceFee,
  };
}

// Emergency Loan specific validation (placeholder for future implementation)
function validateEmergencyLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  // TODO: Implement Emergency Loan specific rules when "Key Emergency Loan Conditions" are provided
  // Expected: tenure-based maximum amounts, fixed 2-year term, specific eligibility criteria

  return {
    ...baseCheck,
    dynamicMaxLoanable: Math.min(availableEquity, loan.maxAmount),
    // Placeholder values based on loan configuration table
    dynamicMaxPaymentMonths: 24, // 2 years fixed
    dynamicMaxYearsPayment: 2,
  };
}

// Special Loan specific validation (placeholder for future implementation)
function validateSpecialLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  // TODO: Implement Special Loan specific rules when "Key Special Loan Conditions" are provided
  // Expected: fixed 6-month term, TIN requirement, specific conditions

  return {
    ...baseCheck,
    dynamicMaxLoanable: Math.min(availableEquity, loan.maxAmount),
    // Placeholder values based on loan configuration table
    dynamicMaxPaymentMonths: 6, // 6 months fixed
    dynamicMaxYearsPayment: 0.5,
  };
}

// Short Term Loan specific validation (basic implementation based on table)
function validateShortTermLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  // Minimum 3 years of membership requirement
  if (userTenure < 36) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Short Term Loan requires minimum 3 years (36 months) of membership. Your tenure: ${userTenure} months`,
    };
  }

  // Fixed amount validation (₱5,000 only)
  if (proposedAmount !== null && proposedAmount !== 5000) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Short Term Loan amount is fixed at ₱5,000`,
    };
  }

  return {
    ...baseCheck,
    dynamicMaxLoanable: 5000, // Fixed amount
    dynamicMaxPaymentMonths: 3, // 3 months fixed
    dynamicMaxYearsPayment: 0.25,
  };
}

// Car Loan specific validation (basic implementation based on table)
function validateCarLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  // Minimum 10 years of membership requirement
  if (userTenure < 120) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Car Loan requires minimum 10 years (120 months) of membership. Your tenure: ${userTenure} months`,
    };
  }

  return {
    ...baseCheck,
    dynamicMaxLoanable: Math.min(availableEquity, loan.maxAmount),
    dynamicMaxPaymentMonths: 72, // 6 years fixed
    dynamicMaxYearsPayment: 6,
  };
}

// Motorcycle Loan specific validation (basic implementation based on table)
function validateMotorcycleLoanSpecific(
  baseCheck,
  loan,
  currentUser,
  userTenure,
  availableEquity,
  proposedAmount
) {
  // Minimum 10 years of membership requirement
  if (userTenure < 120) {
    return {
      ...baseCheck,
      eligible: false,
      reason: `Motorcycle Loan requires minimum 10 years (120 months) of membership. Your tenure: ${userTenure} months`,
    };
  }

  return {
    ...baseCheck,
    dynamicMaxLoanable: Math.min(availableEquity, loan.maxAmount),
    dynamicMaxPaymentMonths: 36, // 3 years fixed
    dynamicMaxYearsPayment: 3,
  };
}

export default App;
