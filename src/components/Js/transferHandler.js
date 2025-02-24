export const handleTransfer = async (event, transferDetails, accountDetails, setTransferDetails, fetchTransactions) => {
    event.preventDefault();
  
    console.log("✅ Transfer button clicked!"); // Check if the function is triggered
  
    const transferData = {
      senderAccount: accountDetails?.accountNumber || "DEFAULT_ACCOUNT",
      receiverAccount: transferDetails.receiverAccount,
      ifscCode: transferDetails.ifscCode,
      amount: parseFloat(transferDetails.amount),
      expenseType: transferDetails.expenseType,
    };
  
    console.log("📤 Sending Transfer Data:", transferData); // Debugging
  
    try {
      const response = await fetch("http://localhost:9099/api/transactions/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });
  
      console.log("🔄 Response Status:", response.status); // Check if the API responds
  
      if (!response.ok) {
        throw new Error("🚨 Transfer failed!");
      }
  
      const result = await response.json();
      console.log("✅ Server Response:", result);
  
      alert("🎉 Money transferred successfully!");
  
      setTransferDetails({
        receiverAccount: "",
        ifscCode: "",
        amount: "",
        expenseType: "",
      });
  
      fetchTransactions(); // Refresh transaction history
  
    } catch (error) {
      console.error("❌ Error during transfer:", error);
      alert("Error: " + error.message);
    }
  };
  