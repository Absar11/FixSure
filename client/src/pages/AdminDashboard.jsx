import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../utils/api';
import { FiLogOut, FiCheckCircle, FiTrash2, FiFileText, FiPrinter, FiX, FiFilePlus, FiXCircle, FiEye, FiBell, FiStar, FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Leads');
  const [showBillModal, setShowBillModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [viewingBillId, setViewingBillId] = useState(null);
  
  const [billData, setBillData] = useState({
    items: [{ description: '', qty: 1, amount: '' }],
    discount: 0,
    paymentMode: 'UPI',
    warrantyNote: '45 Days Warranty on Gas Charging. (Warranty applies only to the specific area serviced by our technician.)'
  });

  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDirectBill, setIsDirectBill] = useState(false);
  const [manualCustomer, setManualCustomer] = useState({ name: '', phone: '', address: '' });
  
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/api/inquiries');
      setInquiries(response.data);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get('/api/reviews/all');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    
    fetchInquiries();
    fetchReviews();

    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('newInquiry', (data) => {
      setInquiries(prev => [data, ...prev]);
      toast.success(`New Lead: ${data.name}`, { icon: '🔔' });
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/inquiries/${id}`, { status });
      setInquiries(prev => prev.map(inq => inq._id === id ? res.data : inq));
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/api/inquiries/${id}`);
      setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: 'Deleted' } : inq).filter(i => i.status !== 'Deleted'));
      toast.success('Deleted successfully');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleReviewStatus = async (id, status) => {
    try {
      await api.put(`/api/reviews/${id}/status`, { status });
      toast.success(`Review ${status.toLowerCase()}`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isDirectBill) {
        res = await api.post('/api/inquiries/generate-direct-bill', {
          customerName: manualCustomer.name,
          customerPhone: manualCustomer.phone,
          customerAddress: manualCustomer.address,
          ...billData
        });
      } else {
        res = await api.post(`/api/inquiries/${selectedInquiry._id}/bill`, billData);
      }

      toast.success('Bill generated!');
      setShowBillModal(false);
      setIsDirectBill(false);
      setManualCustomer({ name: '', phone: '', address: '' });
      fetchInquiries();
      
      // Open PDF in new tab for printing/downloading
      const billId = res.data.billId;
      if (billId) {
        const pdfUrl = `${API_BASE_URL}/api/inquiries/bill-file/${billId}`;
        window.open(pdfUrl, '_blank');
      }
    } catch (err) {
      console.error('Bill Error:', err);
      toast.error('Error generating bill');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    const matchesService = serviceFilter === 'All' || inq.serviceType.includes(serviceFilter);
    const matchesDate = !dateFilter || new Date(inq.createdAt).toISOString().split('T')[0] === dateFilter;
    const matchesSearch = !searchQuery || inq.phone.includes(searchQuery);
    return matchesStatus && matchesService && matchesDate && matchesSearch;
  });

  const pendingLeadsCount = inquiries.filter(inq => inq.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-brand-navy text-white shadow-xl py-4 px-6 md:px-12 flex justify-between items-center sticky top-10 md:top-8 z-40">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-black tracking-tighter">FixSure <span className="text-brand-orange">Admin</span></h1>
          <div className="relative group">
            <FiBell className={`text-2xl cursor-pointer ${pendingLeadsCount > 0 ? 'animate-bounce text-brand-orange' : ''}`} />
            {pendingLeadsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-brand-navy">
                {pendingLeadsCount}
              </span>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-red-600 px-4 py-2 rounded-xl transition-all font-bold text-sm uppercase tracking-widest">
          <FiLogOut /> <span>Logout</span>
        </button>
      </header>

      <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
            <button
              onClick={() => setActiveTab('Leads')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Leads' ? 'bg-brand-navy text-white shadow-lg' : 'text-gray-500 hover:text-brand-navy'}`}
            >
              Service Leads
            </button>
            <button
              onClick={() => setActiveTab('Reviews')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all relative ${activeTab === 'Reviews' ? 'bg-brand-navy text-white shadow-lg' : 'text-gray-500 hover:text-brand-navy'}`}
            >
              Reviews
              {pendingReviewsCount > 0 && (
                <span className="ml-2 bg-brand-orange text-white px-2 py-0.5 rounded-full text-[10px]">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
          </div>

          <button 
            onClick={() => { setIsDirectBill(true); setSelectedInquiry(null); setShowBillModal(true); }}
            className="flex items-center space-x-2 bg-brand-navy text-white px-6 py-4 rounded-2xl shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest"
          >
            <FiFilePlus size={18} /> <span>Create Manual Bill</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-gray-300 animate-pulse">LOADING DATA...</div>
        ) : activeTab === 'Leads' ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['All', 'Pending', 'Completed', 'Cancelled'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-400 hover:text-brand-navy'}`}>{s}</button>
                  ))}
                </div>
                <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-orange">
                  <option value="All">All Services</option>
                  <option value="AC">AC</option>
                  <option value="Refrigerator">Fridge</option>
                  <option value="Washing Machine">Washing Machine</option>
                  <option value="Microwave">Microwave</option>
                </select>
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-black uppercase outline-none" />
              </div>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search Phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-navy" />
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                      <th className="px-8 py-6">Customer</th>
                      <th className="px-6 py-6">Service</th>
                      <th className="px-6 py-6">Address</th>
                      <th className="px-6 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredInquiries.length === 0 ? (
                      <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No Leads Found</td></tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="font-black text-brand-navy uppercase text-sm tracking-tight">{inq.name}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{inq.phone}</p>
                          </td>
                          <td className="px-6 py-6">
                            <span className="inline-block px-3 py-1 bg-orange-50 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">{inq.serviceType}</span>
                          </td>
                          <td className="px-6 py-6 max-w-xs">
                            <p className="text-xs text-gray-600 font-medium truncate" title={inq.address}>{inq.address}</p>
                            {inq.message && (
                              <p className="text-[10px] text-brand-orange font-bold mt-1 italic leading-tight">
                                Note: {inq.message}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${inq.status === 'Completed' ? 'bg-green-100 text-green-700' : inq.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{inq.status}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-2">
                              {inq.status === 'Pending' && (
                                <>
                                  <button onClick={() => { setSelectedInquiry(inq); setShowBillModal(true); }} className="p-2 bg-brand-navy text-white rounded-xl shadow-lg hover:scale-110 transition-transform"><FiFilePlus size={18} /></button>
                                  <button onClick={() => updateStatus(inq._id, 'Cancelled')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"><FiXCircle size={18} /></button>
                                </>
                              )}
                              <button onClick={() => deleteInquiry(inq._id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100"><FiTrash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Reviews Management UI */
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight">Manage Reviews</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                    <th className="px-10 py-6">Customer</th>
                    <th className="px-6 py-6">Rating</th>
                    <th className="px-6 py-6">Message</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reviews.length === 0 ? (
                    <tr><td colSpan="5" className="px-10 py-20 text-center text-gray-400 font-bold">No reviews found</td></tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-10 py-6">
                          <p className="font-black text-brand-navy uppercase text-sm tracking-tight">{r.name}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{r.location || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex text-brand-orange space-x-0.5">
                            {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < r.rating ? 'currentColor' : 'none'} size={14} />)}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-600 font-medium max-w-xs truncate">{r.message}</td>
                        <td className="px-6 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-2">
                          {r.status !== 'Approved' && (
                            <button onClick={() => handleReviewStatus(r._id, 'Approved')} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"><FiCheckCircle size={18} /></button>
                          )}
                          <button onClick={() => handleDeleteReview(r._id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"><FiTrash2 size={18} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {showBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl p-8 md:p-12 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setShowBillModal(false); setIsDirectBill(false); }} className="absolute top-6 right-6 text-gray-400 hover:text-brand-navy"><FiX size={24} /></button>
            <h3 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-8">
              {isDirectBill ? 'Create Manual Bill' : 'Generate Bill'}
            </h3>
            
            <form onSubmit={handleGenerateBill} className="space-y-6">
              {isDirectBill && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 mb-6">
                  <div className="col-span-2"><p className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-4">Customer Information</p></div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-2">Name</label>
                    <input type="text" required value={manualCustomer.name} onChange={(e) => setManualCustomer({...manualCustomer, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold text-sm" placeholder="Customer Name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-2">Phone</label>
                    <input type="tel" required maxLength="10" value={manualCustomer.phone} onChange={(e) => setManualCustomer({...manualCustomer, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold text-sm" placeholder="10 Digit Number" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-2">Address</label>
                    <input type="text" required value={manualCustomer.address} onChange={(e) => setManualCustomer({...manualCustomer, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold text-sm" placeholder="Full Address" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Service Items</p>
                {billData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" placeholder="Description (e.g. AC Gas Charging)" required value={item.description} onChange={(e) => {
                      const newItems = [...billData.items];
                      newItems[idx].description = e.target.value;
                      setBillData({...billData, items: newItems});
                    }} className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm outline-none" />
                    <input type="number" placeholder="Amt" required value={item.amount} onChange={(e) => {
                      const newItems = [...billData.items];
                      newItems[idx].amount = e.target.value;
                      setBillData({...billData, items: newItems});
                    }} className="w-24 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm outline-none" />
                  </div>
                ))}
                <button type="button" onClick={() => setBillData({...billData, items: [...billData.items, { description: '', qty: 1, amount: '' }]})} className="text-[10px] font-black text-brand-navy hover:text-brand-orange uppercase tracking-widest flex items-center gap-1 ml-2">+ Add More Item</button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-2">Discount (₹)</label>
                  <input type="number" value={billData.discount} onChange={(e) => setBillData({...billData, discount: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block ml-2">Payment Mode</label>
                  <select value={billData.paymentMode} onChange={(e) => setBillData({...billData, paymentMode: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-bold text-sm outline-none">
                    <option value="UPI">UPI / Scanner</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all mt-4">Generate & View Bill</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;