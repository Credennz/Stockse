import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const PaymentUser = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [paymentData, setPaymentData] = useState([
    { month: "January 2024", payoutAmount: "1,00,000", totalPayout: "2,00,000", status: "Received" },
    { month: "February 2024", payoutAmount: "5,00,000", totalPayout: "510000", status: "Done" },
    { month: "March 2024", payoutAmount: "4,00,000", totalPayout: "600000", status: "Done" },
    { month: "April 2024", payoutAmount: "8,00,000", totalPayout: "844844", status: "Done" },
    { month: "May 2024", payoutAmount: "10,00,000", totalPayout: "8448441", status: "Received" },
  ]);
  const [filteredData, setFilteredData] = useState(paymentData);

  useEffect(() => {
    updateCurrentDate();
  }, []);

  const updateCurrentDate = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = paymentData.filter((payment) =>
      payment.month.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="sun-container">
      <div className="sun-header">
        <h1 className="sun-title">Payment Details</h1>
      </div>
      <div className="sun-search-container">
        <div className="sun-search-box">
          <Search className="sun-search-icon" />
          <input
            type="text"
            id="sun-searchInput"
            className="sun-search-input"
            placeholder="Search By (Month year)"
            onChange={handleSearch}
          />
        </div>
        <div className="sun-current-date" >{currentDate}</div>
      </div>
      <div className="sun-bro">
        <table id="sun-paymentTable">
          <thead>
            <tr>
              <th>Month</th>
              <th>Payout Amount</th>
              <th>Total Payout</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody id="sun-paymentTableBody">
            {filteredData.map((payment, index) => (
              <tr key={index}>
                <td className="sun-month-cell">{payment.month}</td>
                <td>{payment.payoutAmount}</td>
                <td className="sun-total-payout-cell">{payment.totalPayout}</td>
                <td>
                  <span className={`sun-status ${payment.status === "Received" ? "sun-status-received" : "sun-status-done"}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentUser;