"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  Home,
  FileText,
  User,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  LogOut,
  Edit3,
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
} from "lucide-react"; // Added Car, Bike, Clock

// App Name (Can be changed)
const APP_NAME = "CPU Retirement Plan Office";

// --- Mock Data Structures based on ERD Alternative #2 ---

// Default Existing User (Profile prefilled, some fields non-editable on profile edit)
const defaultMockUser = {
  id: "user1", // PK from users table
  cpuld: "12-3456-78",
  surname: "Dela Cruz",
  firstname: "Juan",
  middlename: "Ponce",
  cpuEmail: "user@cpu.edu.ph", // Login email
  birthdate: "1985-07-15",
  civilStatus: "Married", // enum: Single, Married
  sex: "Male", // enum
  dateOfMembership: "2010-06-01", // Not editable by user on profile
  fsClassification: "Faculty", // enum: Faculty, Staff - Not editable by user
  department: "College of Engineering",
  dateHired: "2010-06-01", // Not editable by user
  contactNumber: "09123456789",
  isActive: true,
  pin: "123456", // Not stored directly like this in a real app
  hasPin: true,
  profileComplete: true,
};

// Template for a New User (Profile to be partially filled from "admin system")
const newMockUserBaseTemplate = {
  // Base info assumed to be in admin system
  id: "",
  cpuld: "98-7654-32", // Example prefilled
  surname: "Santos", // Example prefilled
  firstname: "Maria", // Example prefilled
  middlename: "", // Might be missing
  cpuEmail: "", // Set from login screen
  department: "College of Arts and Sciences", // Example prefilled
  // Fields user needs to fill or confirm if missing/incorrect
  birthdate: "",
  civilStatus: "",
  sex: "",
  contactNumber: "",
  // System-set after profile completion
  dateOfMembership: "",
  fsClassification: "",
  dateHired: "",
  isActive: true,
  pin: "",
  hasPin: false,
  profileComplete: false,
};

// Mock Equities Data (linked to userId)
const mockEquities = [
  {
    id: "eq1",
    userId: "user1",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    contribution: 12000,
    withdrawals: 1000,
    endingEquity: 65000,
    beginningBalance: { contribution: 50000, income: 4000 },
    endingBalance: { contribution: 62000, income: 3000 },
  },
  {
    // Equity for the new user once their profile is complete
    id: "eq_new_user_placeholder",
    userId: "newMockUserIdPlaceholder",
    startDate: "",
    endDate: "",
    contribution: 0,
    withdrawals: 0,
    endingEquity: 0,
    beginningBalance: { contribution: 0, income: 0 },
    endingBalance: { contribution: 0, income: 0 },
  },
];

// Mock Active Loans Data (aligned with ERD)
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

// Mock Loan Breakdown (Amortization) - simplified
const mockLoanBreakdown = [
  {
    schoolYear: "2023-2024",
    paymentDate: "2023-02-20",
    principalPaid: 2400,
    interestPaid: 200,
    remainingBalance: 57600,
  },
  {
    schoolYear: "2023-2024",
    paymentDate: "2023-03-20",
    principalPaid: 2420,
    interestPaid: 180,
    remainingBalance: 55180,
  },
];

// Updated Loan Types
const mockEligibleLoans = [
  {
    id: "el1",
    name: "Regular Loan",
    description: "General purpose loan with standard terms.",
    eligible: true,
    type: "Regular",
    icon: Briefcase,
  },
  {
    id: "el2",
    name: "Special Loan",
    description: "Loan for specific occasions or needs, may have unique terms.",
    eligible: true,
    type: "Special",
    icon: Star,
  },
  {
    id: "el3",
    name: "Emergency Loan",
    description: "For unforeseen urgent financial needs.",
    eligible: true,
    type: "Emergency",
    icon: HelpCircle,
  },
  {
    id: "el4",
    name: "Car Loan",
    description: "Finance your new or used car purchase.",
    eligible: true,
    type: "Car",
    icon: Car,
  },
  {
    id: "el5",
    name: "Motorcycle Loan",
    description: "Get funding for a new motorcycle.",
    eligible: true,
    type: "Motorcycle",
    icon: Bike,
  },
  {
    id: "el6",
    name: "Short Term Loan",
    description: "Quick loan for immediate, short-duration financial gaps.",
    eligible: true,
    type: "ShortTerm",
    icon: Clock,
  },
];

const mockSubmittedApplications = [
  {
    id: "app1",
    type: "Special Loan",
    submissionDate: "2024-03-01",
    status: "Pending Review",
    adminNotes: "Awaiting documents.",
    proposedAmount: 75000,
  },
  {
    id: "app2",
    type: "Regular Loan",
    submissionDate: "2024-02-15",
    status: "Approved",
    adminNotes: "Funds disbursed.",
    approvedAmount: 50000,
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

// --- Main App Component ---
function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [userLoginEmail, setUserLoginEmail] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showLoanBreakdownModal, setShowLoanBreakdownModal] = useState(false);
  const [selectedLoanToApply, setSelectedLoanToApply] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isNewUserFlow, setIsNewUserFlow] = useState(false);

  const navigate = (screen) => {
    setCurrentScreen(screen);
    setErrorMessage("");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserData = localStorage.getItem("currentUserData");
    if (storedIsLoggedIn === "true" && storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      setCurrentUser(parsedUser);
      setIsLoggedIn(true);
      // If user was in the middle of new user setup, resume there
      if (!parsedUser.profileComplete && parsedUser.hasPin) {
        setIsNewUserFlow(true); // Ensure this flag is set if resuming incomplete profile
        navigate("userFillInfo");
      } else {
        navigate("home");
      }
    }
  }, []);

  const handleLoginAttempt = (email) => {
    setUserLoginEmail(email);
    const newUserId = `new${Date.now()}`; // Generate a unique ID for new user
    if (email.toLowerCase() === "newuser@cpu.edu.ph") {
      setIsNewUserFlow(true);
      // Simulate fetching some pre-filled data from "admin system"
      setCurrentUser({
        ...newMockUserBaseTemplate, // Base template with some pre-filled data
        cpuEmail: email,
        id: newUserId, // Assign the generated unique ID
      });
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
    // For new user, some data is prefilled, some system-set later
    // The prefilled data (cpuld, names, department) is already in currentUser from newMockUserBaseTemplate
    setCurrentUser((prev) => ({ ...prev, hasPin: true, pin: pin }));
    if (isNewUserFlow) {
      navigate("userFillInfo");
    } else {
      handleLoginSuccess();
    }
  };

  const handleLoginSuccess = () => {
    if (!currentUser) return;
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUserData", JSON.stringify(currentUser));

    if (!currentUser.profileComplete && isNewUserFlow) {
      navigate("userFillInfo");
    } else if (!currentUser.profileComplete && !isNewUserFlow) {
      // This case implies an existing user somehow has an incomplete profile.
      // For mockup, we'll also send to userFillInfo.
      navigate("userFillInfo");
    } else {
      navigate("home");
    }
  };

  const handleProfileComplete = (filledProfileData) => {
    // filledProfileData contains what the user entered/confirmed on UserFillInfoScreen
    const systemSetData = isNewUserFlow
      ? {
          dateOfMembership: new Date().toISOString().split("T")[0],
          fsClassification:
            filledProfileData.department === "College of Engineering"
              ? "Faculty"
              : filledProfileData.department === "College of Arts and Sciences"
              ? "Staff"
              : "Staff", // Adjusted mock logic
          dateHired: new Date(
            new Date().setFullYear(
              new Date().getFullYear() -
                (filledProfileData.cpuld === "CPU-NEW001" ? 2 : 1)
            )
          )
            .toISOString()
            .split("T")[0], // Mock: 2 years ago for specific new user
        }
      : {};

    const fullyUpdatedUser = {
      ...currentUser,
      ...filledProfileData,
      ...systemSetData,
      profileComplete: true,
    };
    setCurrentUser(fullyUpdatedUser);

    // If it was a new user, create a placeholder equity for them
    if (isNewUserFlow) {
      const newEquity = mockEquities.find(
        (eq) => eq.id === "eq_new_user_placeholder"
      );
      if (newEquity) {
        newEquity.userId = fullyUpdatedUser.id; // Link to the new user
        newEquity.startDate = new Date().toISOString().split("T")[0]; // Start today
      }
    }

    setIsNewUserFlow(false);
    // After profile is complete, proceed to log in (which saves data and navigates to home)
    // Need to ensure isLoggedIn is true and data is saved before navigating
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
        return (
          <LoginPinScreen
            navigate={navigate}
            userEmailForDisplay={currentUser?.cpuEmail || userLoginEmail}
            storedPin={currentUser?.pin}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            showPin={showPin}
            setShowPin={setShowPin}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "createPin":
        return (
          <CreatePinScreen
            navigate={navigate}
            userEmailForDisplay={currentUser?.cpuEmail || userLoginEmail}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            showPin={showPin}
            setShowPin={setShowPin}
            onPinSet={handlePinSet}
          />
        );
      case "userFillInfo":
        // Pass currentUser which contains pre-filled data for new users
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
      case "activeLoan":
        return (
          <ActiveLoanScreen
            navigate={navigate}
            loan={selectedLoan}
            setShowLoanBreakdownModal={setShowLoanBreakdownModal}
          />
        );
      case "loanApplications":
        return (
          <LoanApplicationsScreen
            navigate={navigate}
            setSelectedLoanToApply={setSelectedLoanToApply}
            currentUser={currentUser}
            mockEquities={mockEquities}
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
        <main className="flex-grow p-4 pt-6 overflow-y-auto">
          {renderScreen()}
        </main>
        {isLoggedIn &&
          [
            "home",
            "loanApplications",
            "profile",
            "notifications",
            "settings",
          ].includes(currentScreen) && (
            <BottomNavBar currentScreen={currentScreen} navigate={navigate} />
          )}
        {showLoanBreakdownModal && selectedLoan && (
          <LoanBreakdownModal
            loan={selectedLoan}
            onClose={() => setShowLoanBreakdownModal(false)}
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
      <h1 className="text-3xl text-center font-bold text-blue-600 mb-8">
        {APP_NAME}
      </h1>
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>
        <input
          type="email"
          placeholder="CPU Email (e.g., user@cpu.edu.ph or newuser@cpu.edu.ph)"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// 2. Login Screen (PIN Entry View)
function LoginPinScreen({
  navigate,
  userEmailForDisplay,
  storedPin,
  setErrorMessage,
  errorMessage,
  showPin,
  setShowPin,
  onLoginSuccess,
}) {
  const [pinInput, setPinInput] = useState("");
  const handleLogin = () => {
    if (pinInput === storedPin) {
      setErrorMessage("");
      onLoginSuccess();
    } else {
      setErrorMessage("Invalid PIN. Please try again.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
      <button
        onClick={() => navigate("login")}
        className="absolute top-6 left-4 text-blue-600 hover:text-blue-800"
      >
        <ChevronLeft size={28} />
      </button>
      <h1 className="text-xl text-center font-bold text-blue-600 mb-8">
        {APP_NAME}
      </h1>
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Enter PIN
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Account: <span className="font-medium">{userEmailForDisplay}</span>
        </p>
        <div className="relative">
          <input
            type={showPin ? "text" : "password"}
            placeholder="PIN"
            value={pinInput}
            onChange={(e) =>
              setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-500 mb-4"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200 mb-4"
        >
          Login
        </button>
        <button
          onClick={() =>
            alert("Forgot PIN functionality not implemented in mockup.")
          }
          className="text-sm text-blue-600 hover:underline text-center w-full"
        >
          Forgot PIN?
        </button>
      </div>
    </div>
  );
}

// 3. Create PIN Screen
function CreatePinScreen({
  navigate,
  userEmailForDisplay,
  setErrorMessage,
  errorMessage,
  showPin,
  setShowPin,
  onPinSet,
}) {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const handleSetPin = () => {
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      setErrorMessage("PIN must be 6 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMessage("PINs do not match.");
      return;
    }
    setErrorMessage("");
    alert("PIN successfully created!");
    onPinSet(newPin);
  };
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-100px)] px-4 pt-8">
      <button
        onClick={() => navigate("login")}
        className="absolute top-6 left-4 text-blue-600 hover:text-blue-800"
      >
        <ChevronLeft size={28} />
      </button>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Create Your PIN
      </h2>
      <p className="text-gray-600 mb-1 text-center">
        For account: <span className="font-medium">{userEmailForDisplay}</span>
      </p>
      <p className="text-gray-600 mb-6 text-center">
        Set a 6-digit PIN for secure access.
      </p>
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="relative mb-4">
          <input
            type={showPin ? "text" : "password"}
            placeholder="New PIN (6 digits)"
            value={newPin}
            onChange={(e) =>
              setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-500"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <input
          type={showPin ? "text" : "password"}
          placeholder="Confirm New PIN"
          value={confirmPin}
          onChange={(e) =>
            setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleSetPin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200"
        >
          Set PIN
        </button>
      </div>
    </div>
  );
}

// 4. User Fill Info Screen (Updated for prefill)
function UserFillInfoScreen({
  navigate,
  setErrorMessage,
  errorMessage,
  prefilledData,
  onProfileComplete,
}) {
  // Initialize state with prefilledData or empty strings
  const [cpuld, setCpuld] = useState(prefilledData?.cpuld || "");
  const [surname, setSurname] = useState(prefilledData?.surname || "");
  const [firstname, setFirstname] = useState(prefilledData?.firstname || "");
  const [middlename, setMiddlename] = useState(prefilledData?.middlename || "");
  const [birthdate, setBirthdate] = useState(prefilledData?.birthdate || "");
  const [civilStatus, setCivilStatus] = useState(
    prefilledData?.civilStatus || ""
  );
  const [sex, setSex] = useState(prefilledData?.sex || "");
  const [department, setDepartment] = useState(prefilledData?.department || ""); // Department can be prefilled
  const [contactNumber, setContactNumber] = useState(
    prefilledData?.contactNumber || ""
  );

  const handleSaveAndContinue = () => {
    // Validate only fields that user is expected to fill or confirm
    if (
      /*!cpuld.trim() ||*/ !surname.trim() ||
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
      // Only pass data that was on the form
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
    alert("Profile information updated/confirmed!");
    onProfileComplete(filledProfileData);
  };

  return (
    <div className="px-4 pt-8">
      <PageHeader
        title="Confirm/Complete Profile"
        onBack={() => navigate("createPin")}
      />
      <p className="text-gray-600 mb-1 text-center">
        Account: <span className="font-medium">{prefilledData?.cpuEmail}</span>
      </p>
      <p className="text-gray-600 mb-6 text-center">
        Please confirm or complete your information below.
      </p>
      <div className="w-full p-6 bg-white rounded-lg shadow-md space-y-4">
        {/* CPU LD might be pre-filled and non-editable, or editable if missing */}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200 mt-4"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}

// Helper InputField (add isReadOnly prop)
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
// Helper SelectField (no change needed for readOnly as it's more complex for select)
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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {displayName}!
      </h1>
      {hasPendingApplication && pendingApplication && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow mb-6"
          role="alert"
        >
          <p className="font-bold">Pending Loan Application</p>
          <p>
            {pendingApplication.type} - {pendingApplication.status}
          </p>
          <button
            onClick={() => navigate("loanApplicationStatus")}
            className="mt-2 text-sm text-yellow-800 hover:underline font-semibold"
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
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
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
                    className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    See Details
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-white rounded-lg shadow-md border">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              You don't have any active loans at the moment.
            </p>
            <button
              onClick={() => navigate("loanApplications")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
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
function ActiveLoanScreen({ navigate, loan, setShowLoanBreakdownModal }) {
  if (!loan)
    return (
      <div className="text-center p-8">
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
    <div>
      <PageHeader title="Loan Details" onBack={() => navigate("home")} />
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">
          {loan.loanTypeDetail}
        </h2>
        <p className="text-sm text-gray-500 mb-4">Loan Code: {loan.loanCode}</p>

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
        <InfoRow label="Date Granted" value={loan.dateGranted || "N/A"} />
        <InfoRow label="Date Released" value={loan.dateReleased || "N/A"} />
        <InfoRow label="Maturity Date" value={loan.maturityDate || "N/A"} />
        <InfoRow label="Loan Term" value={term} />
        <InfoRow
          label="Interest Rate (mock)"
          value={loan.interestRate || "N/A"}
        />
        <InfoRow
          label="Repayment Amount (mock)"
          value={
            loan.repaymentAmount
              ? `₱${loan.repaymentAmount.toLocaleString()}`
              : "N/A"
          }
        />
        <InfoRow label="Outstanding As Of" value={loan.outstandingLoanDate} />

        <button
          onClick={() => setShowLoanBreakdownModal(true)}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          View Loan Breakdown
        </button>
      </div>
    </div>
  );
}
const InfoRow = ({ label, value, isEmphasized = false }) => (
  <div
    className={`flex justify-between py-2 border-b border-gray-100 ${
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

// 7. Loan Breakdown Modal
function LoanBreakdownModal({ loan, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-5 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Loan Breakdown: {loan.loanCode}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left font-semibold text-gray-600">
                  School Year
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-600">
                  Payment Date
                </th>
                <th className="py-2 px-3 text-right font-semibold text-gray-600">
                  Principal Paid
                </th>
                <th className="py-2 px-3 text-right font-semibold text-gray-600">
                  Interest Paid
                </th>
                <th className="py-2 px-3 text-right font-semibold text-gray-600">
                  Remaining Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLoanBreakdown.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-3">{item.schoolYear}</td>
                  <td className="py-2 px-3">{item.paymentDate}</td>
                  <td className="py-2 px-3 text-right">
                    ₱{item.principalPaid.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₱{item.interestPaid.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₱{item.remainingBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// 8. Loan Applications Screen (Updated for new loan types)
function LoanApplicationsScreen({
  navigate,
  setSelectedLoanToApply,
  currentUser,
  mockEquities,
}) {
  const handleApplyNow = (loan, maxAmount) => {
    setSelectedLoanToApply({ ...loan, userMaxLoanable: maxAmount });
    navigate("loanApplicationForm");
  };

  let maxLoanableAmount = 0;
  let userHasEquityRecord = false;

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
      let currentEndingEquity = currentEquityRecord.endingEquity;

      const userActiveLoans = mockActiveLoans.filter(
        (loan) => loan.userId === currentUser.id
      );
      const totalOutstandingLoanAmount = userActiveLoans.reduce(
        (sum, loan) => sum + loan.outstandingLoan,
        0
      );

      maxLoanableAmount = currentEndingEquity - totalOutstandingLoanAmount;
      if (maxLoanableAmount < 0) {
        maxLoanableAmount = 0;
      }
    }
  }

  return (
    <div>
      <PageHeader title="Apply for a Loan" onBack={() => navigate("home")} />

      {currentUser ? (
        <div
          className={`p-4 rounded-lg shadow mb-6 border-l-4 ${
            userHasEquityRecord
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-yellow-50 border-yellow-500 text-yellow-700"
          }`}
          role="alert"
        >
          <p className="font-bold">Your Financial Overview:</p>
          {userHasEquityRecord ? (
            <>
              <p className="text-md">
                Max Loanable Amount:{" "}
                <span className="font-semibold text-lg">
                  ₱
                  {maxLoanableAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="text-xs mt-1">
                This is based on your current equity minus outstanding loan
                balances. All loan applications will be evaluated against this
                amount.
              </p>
            </>
          ) : (
            <p className="text-sm">
              Your equity information is not yet available or fully processed.
              Loan applications may be limited until your equity is established.
            </p>
          )}
        </div>
      ) : null}

      <div className="space-y-4">
        {mockEligibleLoans.map((loan) => {
          const IconComponent = loan.icon || FileText;
          const isButtonDisabled =
            loan.eligible && userHasEquityRecord && maxLoanableAmount <= 0;

          return (
            <div
              key={loan.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex items-center mb-2">
                <IconComponent
                  size={24}
                  className="mr-3 text-blue-500 shrink-0"
                />
                <h3 className="text-lg font-semibold text-blue-600 ">
                  {loan.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 ml-9">
                {loan.description}
              </p>
              {loan.eligible ? (
                <button
                  onClick={() => handleApplyNow(loan, maxLoanableAmount)}
                  disabled={isButtonDisabled}
                  className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm ${
                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Apply Now {isButtonDisabled ? "(Max Loanable Reached)" : ""}
                </button>
              ) : (
                <p className="text-sm text-red-500 font-medium bg-red-100 p-2 rounded-md text-center">
                  Not Generally Eligible
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 9. Loan Application Form Screen
function LoanApplicationFormScreen({
  navigate,
  loanType, // This prop now contains userMaxLoanable: { ...loanData, userMaxLoanable: X }
  setErrorMessage,
  errorMessage,
}) {
  const [amountRequested, setAmountRequested] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fileName, setFileName] = useState("");

  const userMaxLoanable = loanType?.userMaxLoanable; // Extract from loanType

  if (!loanType)
    return (
      <div className="text-center p-8">
        <p className="text-red-500">No loan type selected.</p>
        <button
          onClick={() => navigate("loanApplications")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Back
        </button>
      </div>
    );

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0])
      setFileName(event.target.files[0].name);
    else setFileName("");
  };

  const handleSubmitApplication = () => {
    if (!amountRequested || !purpose) {
      setErrorMessage("Please fill amount and purpose.");
      return;
    }
    const requestedAmountNum = parseFloat(amountRequested);
    if (isNaN(requestedAmountNum) || requestedAmountNum <= 0) {
      setErrorMessage("Requested amount must be a positive number.");
      return;
    }

    if (userMaxLoanable !== undefined && requestedAmountNum > userMaxLoanable) {
      setErrorMessage(
        `Requested amount (₱${requestedAmountNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}) cannot exceed your max loanable amount of ₱${userMaxLoanable.toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}.`
      );
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("You must agree to terms.");
      return;
    }
    setErrorMessage("");
    const newApp = {
      id: `app${Date.now()}`,
      type: loanType.name,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Pending Review",
      proposedAmount: requestedAmountNum,
      adminNotes: "Awaiting initial assessment.",
    };
    mockSubmittedApplications.unshift(newApp);
    alert(
      `Application for ${
        loanType.name
      } submitted for ₱${requestedAmountNum.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}!`
    );
    navigate("loanApplicationStatus");
  };

  return (
    <div>
      <PageHeader
        title={`${loanType.name} Application`}
        onBack={() => navigate("loanApplications")}
      />
      {typeof userMaxLoanable === "number" && (
        <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700 rounded-lg shadow text-sm">
          <p>
            Your maximum loanable amount for new loans is currently:
            <strong className="text-indigo-800 font-semibold text-md">
              {" "}
              ₱
              {userMaxLoanable.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
            .
          </p>
          {userMaxLoanable <= 0 && (
            <p className="mt-1 text-xs">
              You may not be able to request a loan amount at this time if this
              value is zero.
            </p>
          )}
        </div>
      )}
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-4">
        <InputField
          label={`Amount Requested (PHP)${
            typeof userMaxLoanable === "number"
              ? ` (Max: ₱${userMaxLoanable.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })})`
              : ""
          }`}
          type="number"
          value={amountRequested}
          onChange={setAmountRequested}
          placeholder="e.g., 50000"
        />
        <div>
          <label
            htmlFor="purpose"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Purpose of Loan
          </label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe..."
          ></textarea>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Supporting Documents (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload-input"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload-input"
                    name="file-upload-input"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              {fileName && (
                <p className="text-xs text-green-600 mt-1">
                  Selected: {fileName}
                </p>
              )}
            </div>
          </div>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            I agree to the{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Terms link clicked");
              }}
              className="text-blue-600 hover:underline"
            >
              terms and conditions
            </a>
            .
          </span>
        </label>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          onClick={handleSubmitApplication}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}

// 10. Loan Application Status Screen
function LoanApplicationStatusScreen({ navigate }) {
  return (
    <div>
      <PageHeader
        title="My Loan Applications"
        onBack={() => navigate("home")}
      />
      {mockSubmittedApplications.length > 0 ? (
        <div className="space-y-4">
          {mockSubmittedApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-1">
                {app.type}
              </h3>
              <p className="text-sm text-gray-600">
                Proposed Amount:{" "}
                <span className="font-medium text-gray-800">
                  ₱{app.proposedAmount?.toLocaleString()}
                </span>
              </p>
              {app.approvedAmount && (
                <p className="text-sm text-gray-600">
                  Approved Amount:{" "}
                  <span className="font-medium text-green-600">
                    ₱{app.approvedAmount?.toLocaleString()}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-600">
                Submission Date:{" "}
                <span className="font-medium text-gray-800">
                  {app.submissionDate}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-medium ml-1 px-2 py-0.5 rounded-full text-xs ${
                    app.status === "Pending Review"
                      ? "bg-yellow-100 text-yellow-800"
                      : app.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </p>
              {app.adminNotes && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Admin Notes: {app.adminNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-white rounded-lg shadow-md border">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No applications submitted yet.</p>
        </div>
      )}
    </div>
  );
}

// 11. Profile Screen
function ProfileScreen({ navigate, currentUser, userEquities }) {
  if (!currentUser)
    return <div className="p-4 text-center">Loading profile...</div>;

  const getInitials = (first, last) => {
    return (
      `${first ? first.charAt(0) : ""}${
        last ? last.charAt(0) : ""
      }`.toUpperCase() || "U"
    );
  };

  return (
    <div>
      <PageHeader title="My Profile" onBack={() => navigate("home")} />
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4 shrink-0">
            {getInitials(currentUser.firstname, currentUser.surname)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 break-all">
              {currentUser.firstname} {currentUser.middlename}{" "}
              {currentUser.surname}
            </h2>
            <p className="text-sm text-gray-500 break-all">
              {currentUser.cpuEmail}
            </p>
          </div>
        </div>
        <ProfileInfoItem
          icon={<User size={16} className="mr-2 text-blue-500" />}
          label="CPU ID (cpuld)"
          value={currentUser.cpuld}
        />
        <ProfileInfoItem
          icon={<CalendarDays size={16} className="mr-2 text-blue-500" />}
          label="Birth Date"
          value={currentUser.birthdate}
        />
        <ProfileInfoItem
          icon={<User size={16} className="mr-2 text-blue-500" />}
          label="Civil Status"
          value={currentUser.civilStatus}
        />
        <ProfileInfoItem
          icon={<User size={16} className="mr-2 text-blue-500" />}
          label="Sex"
          value={currentUser.sex}
        />
        <ProfileInfoItem
          icon={<Briefcase size={16} className="mr-2 text-blue-500" />}
          label="Department"
          value={currentUser.department}
        />
        <ProfileInfoItem
          icon={<User size={16} className="mr-2 text-blue-500" />}
          label="Contact Number"
          value={currentUser.contactNumber}
        />
        <ProfileInfoItem
          icon={<CalendarDays size={16} className="mr-2 text-gray-500" />}
          label="Date Hired"
          value={currentUser.dateHired}
          isNonEditable={true}
        />
        <ProfileInfoItem
          icon={<CalendarDays size={16} className="mr-2 text-gray-500" />}
          label="Date of Membership"
          value={currentUser.dateOfMembership}
          isNonEditable={true}
        />
        <ProfileInfoItem
          icon={<Briefcase size={16} className="mr-2 text-gray-500" />}
          label="FS Classification"
          value={currentUser.fsClassification}
          isNonEditable={true}
        />

        <button
          onClick={() =>
            alert(
              "Edit Profile (mock): Some fields non-editable. For actual edit, navigate to UserFillInfoScreen with current data."
            )
          }
          className="mt-6 w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition text-sm"
        >
          <Edit3 size={16} className="mr-2" /> Edit Profile
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          My Equities
        </h3>
        {userEquities &&
        userEquities.length > 0 &&
        userEquities.some(
          (eq) => eq.userId === currentUser.id && eq.startDate
        ) ? ( // Check if there's valid equity
          userEquities
            .filter((eq) => eq.userId === currentUser.id && eq.startDate)
            .map((equity) => (
              <div
                key={equity.id}
                className="mb-4 p-3 border rounded-md bg-gray-50"
              >
                <h4 className="font-semibold text-blue-600">
                  Period: {equity.startDate} to {equity.endDate || "Present"}
                </h4>
                <EquityInfoItem
                  icon={
                    <TrendingUp size={16} className="mr-2 text-green-500" />
                  }
                  label="Contributions"
                  value={`₱${equity.contribution?.toLocaleString()}`}
                />
                <EquityInfoItem
                  icon={
                    <TrendingDown size={16} className="mr-2 text-red-500" />
                  }
                  label="Withdrawals"
                  value={`₱${equity.withdrawals?.toLocaleString()}`}
                />
                <EquityInfoItem
                  icon={<DollarSign size={16} className="mr-2 text-blue-500" />}
                  label="Ending Equity"
                  value={`₱${equity.endingEquity?.toLocaleString()}`}
                />
              </div>
            ))
        ) : (
          <p className="text-gray-500">No equity information available.</p>
        )}
      </div>
    </div>
  );
}
const ProfileInfoItem = ({ icon, label, value, isNonEditable }) => (
  <div className="py-3 border-b border-gray-100 flex items-center">
    <div className="shrink-0">{icon}</div>
    <div className="ml-2">
      <p
        className={`text-xs ${
          isNonEditable ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label} {isNonEditable ? "(Read-only)" : ""}
      </p>
      <p className="text-md font-medium text-gray-800 break-all">
        {value || "N/A"}
      </p>
    </div>
  </div>
);
const EquityInfoItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm py-1">
    <span className="flex items-center text-gray-600 shrink-0">
      {icon} <span className="ml-1">{label}:</span>
    </span>
    <span className="font-medium text-gray-800 text-right break-all">
      {value}
    </span>
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
    <div>
      <PageHeader title="Notifications" onBack={() => navigate("home")} />
      {notificationsData.length > 0 ? (
        <div className="space-y-3">
          {notificationsData.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg shadow border-l-4 ${
                notif.read
                  ? "bg-white border-gray-300"
                  : "bg-blue-50 border-blue-500"
              }`}
              onClick={() => toggleReadStatus(notif.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-1 shrink-0 ${
                    notif.read ? "text-gray-400" : "text-blue-500"
                  }`}
                >
                  {notif.title.includes("Approved") ? (
                    <CheckCircle size={20} />
                  ) : notif.title.includes("Reminder") ? (
                    <Bell size={20} />
                  ) : (
                    <MessageSquare size={20} />
                  )}
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold ${
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
                  <p className="text-xs text-gray-400 mt-1">
                    {notif.timestamp}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full self-center ml-2 shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-white rounded-lg shadow-md border">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No notifications yet.</p>
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
    <div>
      <PageHeader title="Settings" onBack={() => navigate("home")} />
      <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
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
            onClick={() => alert("Change PIN not implemented.")}
          />
        </SettingsSection>
        <SettingsSection title="Support">
          <SettingsItem label="FAQ" onClick={() => navigate("faq")} />
          <SettingsItem
            label="Help Us Improve"
            onClick={() => navigate("feedback")}
          />
        </SettingsSection>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
const SettingsSection = ({ title, children }) => (
  <div className="p-4">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);
const SettingsItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center w-full py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md px-2 transition-colors"
  >
    <span>{label}</span>
    <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
  </button>
);
const SwitchItem = ({ label, enabled, setEnabled }) => (
  <div className="flex justify-between items-center py-3 px-2">
    <span className="text-gray-700">{label}</span>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

// 14. FAQ Screen
function FAQScreen({ navigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };
  return (
    <div>
      <PageHeader title="FAQ" onBack={() => navigate("settings")} />
      <div className="space-y-3">
        {mockFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <h3 className="text-md font-semibold text-gray-700">
                {faq.question}
              </h3>
              {openFaq === faq.id ? (
                <ChevronUp size={20} className="text-blue-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>
            {openFaq === faq.id && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 15. Feedback Screen
function FeedbackScreen({ navigate, setErrorMessage, errorMessage }) {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const handleSubmitFeedback = () => {
    if (rating === 0 && !feedbackText.trim()) {
      setErrorMessage("Please provide rating or feedback.");
      return;
    }
    setErrorMessage("");
    console.log("Feedback:", { rating, feedbackText });
    alert("Feedback submitted!");
    setRating(0);
    setFeedbackText("");
    navigate("settings");
  };
  return (
    <div>
      <PageHeader title="Submit Feedback" onBack={() => navigate("settings")} />
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-600 mb-4 text-sm">We value your input!</p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate (optional):
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    rating >= star
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="feedbackText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your feedback:
          </label>
          <textarea
            id="feedbackText"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us..."
          ></textarea>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleSubmitFeedback}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

// --- Common Components ---
function BottomNavBar({ currentScreen, navigate }) {
  const navItems = [
    { name: "Home", screen: "home", icon: Home },
    { name: "Apply", screen: "loanApplications", icon: FileText },
    { name: "Profile", screen: "profile", icon: User },
    { name: "Alerts", screen: "notifications", icon: Bell },
    { name: "Settings", screen: "settings", icon: Settings },
  ];
  return (
    <nav className="sticky bottom-0 w-full max-w-md bg-white border-t border-gray-200 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg w-1/5 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              } transition-colors`}
              aria-label={item.name}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
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
  <div className="flex items-center mb-6 relative h-10">
    {onBack && (
      <button
        onClick={onBack}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 p-2 -ml-2 z-10"
      >
        <ChevronLeft size={28} />
      </button>
    )}
    <h1 className="w-full text-xl font-semibold text-gray-800 text-center">
      {title}
    </h1>
  </div>
);

export default App;
