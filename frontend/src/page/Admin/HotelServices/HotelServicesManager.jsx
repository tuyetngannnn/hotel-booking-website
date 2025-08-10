// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Importing icons
import axios from 'axios';
import Modal from 'react-modal';
import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

const HotelServicesManager = () => {
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({
    Nameservices: "",
    Describeservices: "",
    Locationservices: "",
    Priceservices: "",
    ServicesImage: "",
    weekdays: { from: "", to: "", days: "" },
    sunday: { from: "", to: "", day: "" },
  });

  const [openModal, setOpenModal] = useState(false);
  const [dialogType, setDialogType] = useState('add');
  // eslint-disable-next-line no-unused-vars
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [image, setImage] = useState(null);

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:4000/hotelservices/getallHotelservices');
      setServices(response.data.services);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy dữ liệu',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleClickOpenModal = (type, service) => {
    setDialogType(type);
    if (type === 'edit' && service) {
      setCurrentService(service);
    } else {
      setCurrentService({
        Nameservices: "",
        Describeservices: "",
        Locationservices: "",
        Priceservices: "",
        ServicesImage: "",
        weekdays: { from: "", to: "", days: "" },
        sunday: { from: "", to: "", day: "" },
      });
    }
    setImage(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('weekdays') || name.includes('sunday')) {
      const [dayType, field] = name.split('.');
      setCurrentService((prev) => ({
        ...prev,
        [dayType]: {
          ...prev[dayType],
          [field]: value,
        },
      }));
    } else {
      setCurrentService((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveService = async () => {
    if (isNaN(currentService.Priceservices) || currentService.Priceservices <= 0) {
      setSnackbar({
        open: true,
        message: 'Giá dịch vụ phải là một số dương!',
        severity: 'error',
      });
      return;
    }


    const formData = new FormData();
    formData.append('Nameservices', currentService.Nameservices);
    formData.append('Describeservices', currentService.Describeservices);
    formData.append('Locationservices', currentService.Locationservices);
    formData.append('Priceservices', currentService.Priceservices);
    formData.append('ServicesImage', image); // Append selected image


    formData.append('weekdays.from', currentService.weekdays.from);
    formData.append('weekdays.to', currentService.weekdays.to);
    formData.append('weekdays.days', currentService.weekdays.days);
    formData.append('sunday.from', currentService.sunday.from);
    formData.append('sunday.to', currentService.sunday.to);
    formData.append('sunday.day', currentService.sunday.day);


    try {
      let response;
      if (dialogType === 'add') {
        response = await axios.post('http://localhost:4000/hotelservices/addservices', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.put(`
          http://localhost:4000/hotelservices/updateservices/${currentService._id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }


      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      setServices((prev) =>
        dialogType === 'add' ? [...prev, response.data.service] : prev.map((srv) => (srv._id === currentService._id ? response.data.service : srv))
      );
      // handleCloseDialog();
      handleCloseModal();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra',
        severity: 'error',
      });
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/hotelservices/deleteservices/${id}`);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra',
        severity: 'error',
      });
    }
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="top-bar-admin">
        <Account />
      </div>
      <div className="room-manager-content">
        <h1>Quản Lý Dịch Vụ</h1>
        <div className="add-room-btn-container">
          <button onClick={() => handleClickOpenModal('add')} className="btn-add-room">
            Thêm Dịch Vụ<span className="plus-icon">+</span>
          </button>
        </div>

        <table className="room-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Vị trí</th>
              <th>Ảnh</th>
              <th>Giờ trong tuần</th>
              <th>Giờ cuối tuần</th>
              <th>Ngày trong tuần</th>
              <th>Ngày cuối tuần</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.Nameservices}</td>
                <td>{service.Describeservices}</td>
                <td>{service.Priceservices.toLocaleString('vi-VN')}</td>
                <td>{service.Locationservices}</td>
                <td>
                  <img
                    src={service.ServicesImage?.[0].url}
                    alt={service.Nameservices}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                </td>
                <td>{`${service.weekdays?.from || 'N/A'} - ${service.weekdays?.to || 'N/A'}`}</td>
                <td>{`${service.sunday?.from || 'N/A'} - ${service.sunday?.to || 'N/A'}`}</td>
                <td>{service.weekdays?.days || 'N/A'}</td>
                <td>{service.sunday?.day || 'N/A'}</td>
                <td>
                  <div className="icon-buttons-edit-delete">
                    <button onClick={() => handleClickOpenModal('edit', service)}>
                      <FaEdit className="icon-edit-delete" />
                    </button>
                    <button onClick={() => handleDeleteService(service._id)}>
                      <FaTrash className="icon-edit-delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={openModal} onRequestClose={handleCloseModal} className="modal-content" overlayClassName="modal-overlay">
          <button onClick={handleCloseModal} className="close-icon">
            <FaTimes />
          </button>
          <h2 className="modal-title">{dialogType === 'add' ? 'Thêm Dịch Vụ' : 'Sửa Dịch Vụ'}</h2>
          <label className='label-text'>Tên dịch vụ</label>
          <input
            name="Nameservices"
            value={currentService.Nameservices}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Mô tả dịch vụ</label>
          <input
            name="Describeservices"
            value={currentService.Describeservices}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Vị trí</label>
          <input
            name="Locationservices"
            value={currentService.Locationservices}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Giá dịch vụ</label>
          <input
            name="Priceservices"
            type="number"
            value={currentService.Priceservices}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Giờ mở cửa (Tuần)</label>
          <input
            name="weekdays.from"
            type="time"
            value={currentService.weekdays.from}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Giờ đóng cửa (Tuần)</label>
          <input
            name="weekdays.to"
            type="time"
            value={currentService.weekdays.to}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Ngày trong tuần</label>
          <input
            name="weekdays.days"
            value={currentService.weekdays.days}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Giờ mở cửa (Cuối tuần)</label>
          <input
            name="sunday.from"
            type="time"
            value={currentService.sunday.from}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Giờ đóng cửa (Cuối tuần)</label>
          <input
            name="sunday.to"
            type="time"
            value={currentService.sunday.to}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Ngày cuối tuần</label>
          <input
            name="sunday.day"
            value={currentService.sunday.day}
            onChange={handleChange}
            className="modal-input"
          />

          <label className='label-text'>Ảnh dịch vụ</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button onClick={handleSaveService} className="modal-submit-button">Lưu</button>
        </Modal>
      </div>
    </div>
  );
};

export default HotelServicesManager;