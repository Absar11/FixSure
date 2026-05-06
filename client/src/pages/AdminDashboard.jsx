import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [billData, setBillData] = useState({ amount: '', details: '' });
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      const res = await axios.get('http://192.168.29.141:5000/api/inquiries');
      setInquiries(res.data);
    } catch (err) {
      console.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    fetchInquiries();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://192.168.29.141:5000/api/inquiries/${id}`, { status: newStatus });
      setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`http://192.168.29.141:5000/api/inquiries/${id}`);
      setInquiries(inquiries.filter(inq => inq._id !== id));
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://192.168.29.141:5000/api/inquiries/${selectedInquiry._id}/bill`, billData);
      alert('Bill generated and saved successfully!');
      setShowBillModal(false);
      setBillData({ amount: '', details: '' });
      fetchInquiries();
    } catch (err) {
      alert('Error generating bill');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-brand-navy">Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 font-medium">
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading inquiries...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-navy">Recent Service Requests ({inquiries.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                    <th className="p-6 font-medium">Customer Info</th>
                    <th className="p-6 font-medium">Service Required</th>
                    <th className="p-6 font-medium">Address</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">No service requests found.</td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-brand-navy">{inq.name}</div>
                          <div className="text-gray-500 mt-1">{inq.phone}</div>
                        </td>
                        <td className="p-6">
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium text-xs">
                            {inq.serviceType}
                          </span>
                        </td>
                        <td className="p-6 text-gray-600 max-w-xs truncate">{inq.address}</td>
                        <td className="p-6">
                          <span className={`flex items-center font-medium ${
                            inq.status === 'Completed' ? 'text-green-600' : 
                            inq.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'
                          }`}>
                            {inq.status === 'Completed' && <FiCheckCircle className="mr-1" />}
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          {inq.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setShowBillModal(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                              >
                                Edit/Bill
                              </button>
                              <button 
                                onClick={() => updateStatus(inq._id, 'Cancelled')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => deleteInquiry(inq._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bill Generation Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-brand-navy p-6 text-white">
              <h3 className="text-xl font-bold">Generate Service Bill</h3>
              <p className="text-blue-100 text-sm mt-1">Customer: {selectedInquiry?.name}</p>
            </div>
            <form onSubmit={handleGenerateBill} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Amount (Rs.)</label>
                <input 
                  type="number" 
                  required
                  value={billData.amount}
                  onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Details / Notes</label>
                <textarea 
                  value={billData.details}
                  onChange={(e) => setBillData({ ...billData, details: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none h-24"
                  placeholder="Spare parts used, extra work, etc."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-md"
                >
                  Submit & Gen Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
