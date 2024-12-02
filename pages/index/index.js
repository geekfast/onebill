Page({
  data: {
    billList: [],     // Store the list of bills
    billName: '',     // Store bill name input
    billAmount: '',   // Store bill amount input (formatted display)
    billAmountNumeric: '', // Store the raw numeric value of the amount
    billTypeIndex: 0, // Store selected bill type index
    billTypes: ['Utilities', 'Subscription', 'Family', 'Bills', 'insurance' ,'spending','transport','Rent', 'Others'], // Bill types for the dropdown
    dueDate: '',      // Store due date selected
    showForm: false   // Initially set to false (form hidden)
  },

  // Function to format the amount as Rupiah (IDR) without decimals
  formatRupiah(amount) {
    if (!amount) return 'Rp 0';
    // Format the number with commas as thousands separators
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
  },

  // Handle changes to the bill name input field
  onBillNameChange(e) {
    this.setData({
      billName: e.detail.value
    });
  },

  // Handle changes to the bill type dropdown
  onBillTypeChange(e) {
    this.setData({
      billTypeIndex: e.detail.value
    });
  },

  // Handle real-time changes to the amount input field
  onAmountChange(e) {
    let value = e.detail.value;
    
    // Remove any non-numeric characters (allow only digits)
    value = value.replace(/[^\d]/g, ''); // Remove non-numeric characters

    // Update the raw numeric value
    this.setData({
      billAmountNumeric: value,
      billAmount: this.formatRupiah(value) // Format the value as Rupiah with commas for display
    });
  },

  // Handle changes to the due date picker
  onDueDateChange(e) {
    const selectedDate = e.detail.value; // The date picker returns a date in the format YYYY-MM-DD
    this.setData({
      dueDate: selectedDate // Set the selected date
    });
  },

  // Toggle visibility of the form
  toggleForm() {
    this.setData({
      showForm: !this.data.showForm
    });
  },

  // Add a new bill to the list
  addBill() {
    const { billName, billAmountNumeric, billTypeIndex, dueDate, billList, billTypes } = this.data;

    // Validate inputs
    if (!billName || !billAmountNumeric || !dueDate) {
      my.showToast({
        content: 'Please fill in all fields!',
        type: 'none',
      });
      return;
    }

    // Create a new bill object
    const newBill = {
      name: billName,
      amount: this.formatRupiah(billAmountNumeric), // Store the formatted amount for display
      amountNumeric: billAmountNumeric, // Store the raw numeric amount for calculations
      type: billTypes[billTypeIndex], // Using the selected bill type
      dueDate: dueDate // Store date as YYYY-MM-DD
    };

    // Update the bill list and reset input fields
    this.setData({
      billList: [...billList, newBill],
      billName: '',
      billAmount: '',
      billAmountNumeric: '', // Reset numeric amount
      billTypeIndex: 0, // Reset bill type
      dueDate: '', // Reset due date
      showForm: false // Hide form after adding the bill
    });

    // Persist the updated bill list using synchronous storage
    my.setStorageSync({
      key: 'billList',
      data: this.data.billList
    });

    // After adding a bill, set the default due date to today (if empty)
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    if (!this.data.dueDate) {
      this.setData({
        dueDate: currentDate
      });
    }
  },

  // Remove a bill from the list by index
  onDeleteBill(e) {
    const index = e.currentTarget.dataset.index; // Get the index of the bill to delete
    let billList = this.data.billList;

    // Remove the bill from the list using the index
    billList.splice(index, 1);

    // Update the bill list in data
    this.setData({
      billList: billList
    });

    // Optionally, update local storage after deletion
    my.setStorageSync({
      key: 'billList',
      data: this.data.billList
    });
  },

  // Load saved data from storage on page load
  onLoad() {
    let savedBills = my.getStorageSync({ key: 'billList' }).data || [];
    this.setData({
      billList: savedBills
    });

    // Set current date as the default for dueDate if empty
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    if (!this.data.dueDate) {
      this.setData({
        dueDate: currentDate
      });
    }
  }
});
