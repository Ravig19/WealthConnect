import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    balance: 0,
    fullName: ''
  });

  const [newAccount, setNewAccount] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    accountType: 'savings',
    contactNumber: '',
    permanentAddress: '',
    correspondingAddress: '',
    city: '',
    district: '',
    currentDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [transferDetails, setTransferDetails] = useState({
    receiverAccount: '',
    ifscCode: '',
    amount: '',
    expenseType: ''
  });

  const [depositAmount, setDepositAmount] = useState('');
  
  // New state for expense types and limits
  const [expenseTypes, setExpenseTypes] = useState([
    { name: 'Food', limit: 5000 },
    { name: 'Transportation', limit: 3000 },
    { name: 'Shopping', limit: 10000 }
  ]);
  
  // New state for adding expense type
  const [newExpenseType, setNewExpenseType] = useState({ name: '', limit: '' });
  
  // Track monthly expenses for each type
  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  const [transactions, setTransactions] = useState([]);
  
  // Function to add new expense type
  const handleAddExpenseType = (e) => {
    e.preventDefault();
    if (newExpenseType.name && newExpenseType.limit) {
      setExpenseTypes([...expenseTypes, {
        name: newExpenseType.name,
        limit: parseFloat(newExpenseType.limit)
      }]);
      setNewExpenseType({ name: '', limit: '' });
    }
  };

  // Function to remove expense type
  const handleRemoveExpenseType = (typeName) => {
    setExpenseTypes(expenseTypes.filter(type => type.name !== typeName));
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const ifscCode = 'WEAL' + Math.floor(100000 + Math.random() * 900000);
    const fullName = `${newAccount.firstName} ${newAccount.middleName} ${newAccount.lastName}`.trim();
    
    setAccountDetails({
      accountNumber,
      ifscCode,
      balance: 0,
      fullName
    });
    
    setActiveTab('profile');
    alert(`Account created successfully!\n\nAccount Number: ${accountNumber}\nIFSC Code: ${ifscCode}`);

  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amount = parseFloat(transferDetails.amount);
    if (amount > accountDetails.balance) {
      alert('Insufficient balance');
      return;
    }

    // Calculate current month's expenses for the selected type
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    
    const currentExpenseType = expenseTypes.find(type => type.name === transferDetails.expenseType);
    const currentMonthExpenses = transactions
      .filter(t => 
        t.expenseType === transferDetails.expenseType && 
        t.date.startsWith(currentMonth) &&
        t.type === 'debit'
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // Check if this transaction would exceed the monthly limit
    if (currentExpenseType && (currentMonthExpenses + amount) > currentExpenseType.limit) {
      const shouldProceed = window.confirm(
        `Warning: This transaction will exceed your monthly limit of ₹${currentExpenseType.limit} for ${currentExpenseType.name}. \n\n` +
        `Current spending: ₹${currentMonthExpenses}\n` +
        `This transaction: ₹${amount}\n` +
        `Total after transaction: ₹${currentMonthExpenses + amount}\n\n` +
        'Would you like to proceed anyway?'
      );
      
      if (!shouldProceed) {
        return;
      }
    }

    const newTransaction = {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: amount,
      type: 'debit',
      expenseType: transferDetails.expenseType,
      receiverAccount: transferDetails.receiverAccount
    };

    setTransactions([...transactions, newTransaction]);
    setAccountDetails({
      ...accountDetails,
      balance: accountDetails.balance - amount
    });

    setTransferDetails({
      receiverAccount: '',
      ifscCode: '',
      amount: '',
      expenseType: ''
    });

    alert('Transfer successful!');
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction = {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: amount,
      type: 'credit',
      expenseType: 'Deposit',
    };

    setTransactions([...transactions, newTransaction]);
    setAccountDetails({
      ...accountDetails,
      balance: accountDetails.balance + amount
    });

    setDepositAmount('');
    alert('Deposit successful!');
  };

  const transactionData = {
    labels: expenseTypes.map(type => type.name),
    datasets: [{
      data: expenseTypes.map(type => 
        transactions
          .filter(t => t.expenseType === type.name)
          .reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB',
        '#FFCE56', '#4BC0C0'
      ]
    }]
  };

  // Calculate monthly expenses for the expense types management tab
  const calculateMonthlyExpenses = (typeName) => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    
    return transactions
      .filter(t => 
        t.expenseType === typeName && 
        t.date.startsWith(currentMonth) &&
        t.type === 'debit'
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">Welcome, {accountDetails.fullName || 'User'}</h1>
          <div className="space-x-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
            >
              Profile
            </button>
            {!accountDetails.accountNumber && (
              <button
                onClick={() => setActiveTab('createAccount')}
                className={`px-4 py-2 rounded ${activeTab === 'createAccount' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
              >
                Create Account
              </button>
            )}
            {accountDetails.accountNumber && (
              <>
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`px-4 py-2 rounded ${activeTab === 'deposit' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-4 py-2 rounded ${activeTab === 'transfer' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
                >
                  Transfer Money
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('expenseTypes')}
                  className={`px-4 py-2 rounded ${activeTab === 'expenseTypes' ? 'bg-purple-700 text-white' : 'text-gray-600'}`}
                >
                  Manage Expenses
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Account Profile</h2>
            {accountDetails.accountNumber ? (
              <>
                <p className="mb-2">Full Name: {accountDetails.fullName}</p>
                <p className="mb-2">Account Number: {accountDetails.accountNumber}</p>
                <p className="mb-2">IFSC Code: {accountDetails.ifscCode}</p>
                <p className="text-lg font-semibold">Current Balance: ₹{accountDetails.balance}</p>
              </>
            ) : (
              <p>Please create an account first.</p>
            )}
          </div>
        )}

        {activeTab === 'expenseTypes' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Expense Types</h2>
            
            {/* Add new expense type form */}
            <form onSubmit={handleAddExpenseType} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Expense Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expense Type Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    value={newExpenseType.name}
                    onChange={(e) => setNewExpenseType({ ...newExpenseType, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Limit (₹)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    value={newExpenseType.limit}
                    onChange={(e) => setNewExpenseType({ ...newExpenseType, limit: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition"
              >
                Add Expense Type
              </button>
            </form>

            {/* List of expense types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Expense Types</h3>
              {expenseTypes.map((type) => {
                const monthlyExpense = calculateMonthlyExpenses(type.name);
                const percentageUsed = (monthlyExpense / type.limit) * 100;
                
                return (
                  <div key={type.name} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{type.name}</h4>
                      <button
                        onClick={() => handleRemoveExpenseType(type.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Monthly Limit: ₹{type.limit}</p>
                    <p className="text-sm text-gray-600">Current Spending: ₹{monthlyExpense}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          percentageUsed > 90 ? 'bg-red-500' : 
                          percentageUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Deposit Money</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount to Deposit (₹)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition"
              >
                Deposit
              </button>
            </form>
          </div>
        )}

        {activeTab === 'createAccount' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Account</h2>
            <form onSubmit={handleCreateAccount} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.firstName}
                  onChange={(e) => setNewAccount({ ...newAccount, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.middleName}
                  onChange={(e) => setNewAccount({ ...newAccount, middleName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.lastName}
                  onChange={(e) => setNewAccount({ ...newAccount, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.dob}
                  onChange={(e) => setNewAccount({ ...newAccount, dob: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
                  required
                >
                  <option value="savings">Savings</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.contactNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, contactNumber: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.permanentAddress}
                  onChange={(e) => setNewAccount({ ...newAccount, permanentAddress: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Corresponding Address</label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.correspondingAddress}
                  onChange={(e) => setNewAccount({ ...newAccount, correspondingAddress: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.city}
                  onChange={(e) => setNewAccount({ ...newAccount, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={newAccount.district}
                  onChange={(e) => setNewAccount({ ...newAccount, district: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Transfer Money</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Receiver's Account Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={transferDetails.receiverAccount}
                  onChange={(e) => setTransferDetails({ ...transferDetails, receiverAccount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={transferDetails.ifscCode}
                  onChange={(e) => setTransferDetails({ ...transferDetails, ifscCode: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={transferDetails.amount}
                  onChange={(e) => setTransferDetails({ ...transferDetails, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expense Type</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  value={transferDetails.expenseType}
                  onChange={(e) => setTransferDetails({ ...transferDetails, expenseType: e.target.value })}
                  required
                >
                  <option value="">Select Expense Type</option>
                  {expenseTypes.map((type) => (
                    <option key={type.name} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition"
              >
                Transfer
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Current Balance: ₹{accountDetails.balance}</h3>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <Pie data={transactionData} options={{ responsive: true }} />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <p className="font-medium">Date: {transaction.date}</p>
                      <p className="text-sm text-gray-600">Type: {transaction.expenseType}</p>
                      {transaction.receiverAccount && (
                        <p className="text-sm text-gray-600">To: {transaction.receiverAccount}</p>
                      )}
                    </div>
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;