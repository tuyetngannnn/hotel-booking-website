// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './Statistics.css';
// eslint-disable-next-line no-unused-vars
import { px } from 'framer-motion';

const Stats = () => {
  const [branchId, setBranchId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [roomRevenueData, setRoomRevenueData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isBarChart, setIsBarChart] = useState(false);
  const [activeTab, setActiveTab] = useState('room'); // New state for switching tabs

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:4000/booking/stats/${branchId}/${month}/${year}`);
      const data = await response.json();
      setRoomRevenueData(data.roomRevenueData);
      setEquipmentData(data.equipmentData);
      setServiceData(data.serviceData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (branchId && month && year) {
      fetchStats();
    }
  }, [branchId, month, year]);

  const sortedRoomRevenueData = [...roomRevenueData].sort((a, b) => b.revenue - a.revenue);
  const totalRoomRevenue = sortedRoomRevenueData.reduce((total, item) => total + item.revenue, 0);

  const sortedEquipmentData = [...equipmentData].sort((a, b) => b.count - a.count);
  const totalEquipmentCount = sortedEquipmentData.reduce((total, item) => total + item.count, 0);

  const sortedServiceData = [...serviceData].sort((a, b) => b.count - a.count);
  const totalServiceCount = sortedServiceData.reduce((total, item) => total + item.count, 0);

  // Render content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'room':
        return (
          <>
            <h2 className='h2-content'>Doanh thu phòng</h2>
            <div className="content-container-tk">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  {isBarChart ? (
                    <BarChart data={roomRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="roomName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#162f4a" name="Doanh thu" />
                    </BarChart>
                  ) : (
                    <LineChart data={roomRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="roomName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#162f4a" strokeWidth={1.5} name="Doanh thu" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="table-container">
                <table className="service-table">
                  <caption className="table-caption">Bảng doanh thu phòng</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell">Stt</th>
                      <th className="table-header-cell">Tên phòng</th>
                      <th className="table-header-cell">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRoomRevenueData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.roomName}</td>
                        <td className="table-cell">{item.revenue.toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell"><strong>Tổng doanh thu</strong></td>
                      <td className="table-cell"><strong>{totalRoomRevenue.toLocaleString('vi-VN')}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'equipment':
        return (
          <>
            <h2 className='h2-content'>Sử dụng thiết bị</h2>
            <div className="content-container-tk">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  {isBarChart ? (
                    <BarChart data={equipmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="equipmentName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#EFD099" name="Số lượng" />
                    </BarChart>
                  ) : (
                    <LineChart data={equipmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="equipmentName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#EFD099" strokeWidth={1.5} name="Số lượng" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="table-container">
                <table className="service-table">
                  <caption className="table-caption">Bảng thống kê thiết bị</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell">Stt</th>
                      <th className="table-header-cell">Tên thiết bị</th>
                      <th className="table-header-cell">Số lượng sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEquipmentData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.equipmentName}</td>
                        <td className="table-cell">{item.count}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell"><strong>Tổng số thiết bị sử dụng</strong></td>
                      <td className="table-cell"><strong>{totalEquipmentCount.toLocaleString('vi-VN')}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'service':
        return (
          <>
            <h2 className='h2-content'>Sử dụng dịch vụ</h2>
            <div className="content-container-tk">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  {isBarChart ? (
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#004168" name="Số lượng" />
                    </BarChart>
                  ) : (
                    <LineChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#004168" strokeWidth={1.5} name="Số lượng" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="table-container">
                <table className="service-table">
                  <caption className="table-caption">Bảng thống kê dịch vụ</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell">Stt</th>
                      <th className="table-header-cell">Tên dịch vụ</th>
                      <th className="table-header-cell">Số lượng sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedServiceData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.serviceName}</td>
                        <td className="table-cell">{item.count}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell"><strong>Tổng số dịch vụ sử dụng</strong></td>
                      <td className="table-cell"><strong>{totalServiceCount.toLocaleString('vi-VN')}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className="admin-layout">
      <NavbarAdmin />

      <div className="top-bar-admin">
        <Account />
      </div>
      <div className="room-manager-content">
        <h1>Thống Kê</h1>

        <form onSubmit={(e) => { e.preventDefault(); }} className="horizontal-form-tk">
          <div className="form-group-tk">
            <label className="form-label-tk">Chi nhánh:</label>
            <select className="form-select-tk" value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
              <option value="6708d04a7e5dbdbb11e5384e">Chi nhánh Tân Bình</option>
              <option value="6708d04a7e5dbdbb11e53851">Chi nhánh Hóc Môn</option>
              <option value="6708d04a7e5dbdbb11e53854">Chi nhánh Quận 10</option>
            </select>
          </div>
          <div className="form-group-tk">
            <label className="form-label-tk">Tháng:</label>
            <select className="form-select-tk" value={month} onChange={(e) => setMonth(e.target.value)} required>
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          </div>
          <div className="form-group-tk">
            <label className="form-label-tk">Năm:</label>
            <select className="form-select-tk" value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="form-group-tk">
            <button onClick={() => setIsBarChart(!isBarChart)} className="button-tk">
              {isBarChart ? 'Chuyển sang biểu đồ đường' : 'Chuyển sang biểu đồ cột'}
            </button>
          </div>
        </form>

        {/* Tab navigation */}
        <div className="tab-nav-tk">
          <button onClick={() => setActiveTab('room')} className={`tab-button-tk ${activeTab === 'room' ? 'active' : ''}`}>Doanh thu phòng</button>
          <button onClick={() => setActiveTab('equipment')} className={`tab-button-tk ${activeTab === 'equipment' ? 'active' : ''}`}>Sử dụng thiết bị</button>
          <button onClick={() => setActiveTab('service')} className={`tab-button-tk ${activeTab === 'service' ? 'active' : ''}`}>Sử dụng dịch vụ</button>
        </div>

        {/* Render content based on selected tab */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Stats;
