import React, { useState } from 'react';

function AdminDashboard() {
  const [searchAccount, setSearchAccount] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would fetch user details from a backend
    setUserDetails({
      accountNumber: searchAccount,
      name: 'John Doe',
      balance: 10000,
      accountType: 'Savings',
      contactNumber: '1234567890',
      address: '123 Main St, City',
      transactions: [
        { date: '2023-12-20', amount: 1000, type: 'credit', expenseType: 'Salary' },
        { date: '2023-12-19', amount: 500, type: 'debit', expenseType: 'Shopping' }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Search User Account</h2>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter Account Number"
                className="flex-1 p-2 border rounded-lg"
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
              >
                Search
              </button>
            </div>
          </form>

          {userDetails && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-4">Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Account Number:</p>
                    <p className="font-medium">{userDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-medium">{userDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Type:</p>
                    <p className="font-medium">{userDetails.accountType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Balance:</p>
                    <p className="font-medium">₹{userDetails.balance}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Number:</p>
                    <p className="font-medium">{userDetails.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address:</p>
                    <p className="font-medium">{userDetails.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
                <div className="space-y-2">
                  {userDetails.transactions.map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <p className="font-medium">Date: {transaction.date}</p>
                        <p className="text-sm text-gray-600">Type: {transaction.expenseType}</p>
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
    </div>
  );
}

export default AdminDashboard;