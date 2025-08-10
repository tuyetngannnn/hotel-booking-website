// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Importing icons
import Modal from 'react-modal';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import './RoomTypeManager.css'
import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

const RoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({
    IDRoomtype: '',
    NameRoomtype: '',
    PriceRoomtype: '',
    MaxPeople: '',
  });
  const [editingRoomType, setEditingRoomType] = useState(null); // To track the room type being edited
  const [message, setMessage] = useState(''); // To display success/error messages
  const [isOpen, setIsOpen] = useState(false); // Để điều khiển modal

  // Lấy tất cả loại phòng khi component được tải
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/roomtype/getallroomtype'); // Adjust API endpoint as needed
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại phòng:', error);
      setMessage('Lỗi khi lấy danh sách loại phòng.');
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  //Cập nhật và thêm loại phòng
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra điều kiện trước khi thực hiện thêm/sửa loại phòng
    if (form.MaxPeople < 1) {
      toast.error("Số người tối đa phải lớn hơn hoặc bằng 1.");
      return;
    }

    if (form.PriceRoomtype <= 0) {
      toast.error("Giá phòng phải lớn hơn 0.");
      return;
    }

    try {
      if (editingRoomType) {
        // Cập nhật loại phòng hiện có
        await axios.put(`http://localhost:4000/roomtype/updateroomtype/${form.IDRoomtype}`, form);
        setEditingRoomType(null);
        toast.success("Cập nhật loại phòng thành công")
      } else {
        // Thêm loại phòng mới
        await axios.post('http://localhost:4000/roomtype/addnewRoomtype', form);
      }
      setForm({ IDRoomtype: '', NameRoomtype: '', PriceRoomtype: '', MaxPeople: '' });
      fetchRoomTypes();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi thêm/sửa loại phòng:', error);
    }
  };

  const handleEdit = (roomtype) => {
    setForm(roomtype);
    setEditingRoomType(roomtype.IDRoomtype);
    openModal();
  };


  //Xóa loại phòng
  const handleDelete = async (IDRoomtype) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa loại phòng này không?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/roomtype/deleteroomtype/${IDRoomtype}`);
      setMessage('Xóa loại phòng thành công.');
      fetchRoomTypes();
    } catch (error) {
      console.error('Lỗi khi xóa loại phòng:', error);
      setMessage('Lỗi khi xóa loại phòng.');
    }
  };

  // Mở modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsOpen(false);
    setForm({ IDRoomtype: '', NameRoomtype: '', PriceRoomtype: '', MaxPeople: '' });
    setEditingRoomType(null);
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />

      <div className="top-bar-admin">
        <Account />
      </div>

      <div className="room-manager-content">
        <h1>Quản Lý Loại Phòng</h1>

        {message && <div className="mb-4 text-red-500">{message}</div>} {/* Display message */}

        {/* Form thêm/sửa loại phòng */}
        {/* <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="IDRoomtype" className="block">Mã loại phòng:</label>
              <input
                type="text"
                id="IDRoomtype"
                name="IDRoomtype"
                value={form.IDRoomtype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!!editingRoomType} // Disable editing the ID while updating
              />
            </div>
            <div>
              <label htmlFor="NameRoomtype" className="block">Tên loại phòng:</label>
              <input
                type="text"
                id="NameRoomtype"
                name="NameRoomtype"
                value={form.NameRoomtype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="PriceRoomtype" className="block">Giá:</label>
              <input
                type="number"
                id="PriceRoomtype"
                name="PriceRoomtype"
                value={form.PriceRoomtype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="MaxPeople" className="block">Số người tối đa:</label>
              <input
                type="number"
                id="MaxPeople"
                name="MaxPeople"
                value={form.MaxPeople}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingRoomType ? 'Cập nhật loại phòng' : 'Thêm loại phòng'}
          </button>
        </form> */}

        <div className="add-room-btn-container">
          <button onClick={openModal} className="btn-add-room">
            Thêm loại phòng<span className="plus-icon">+</span>
          </button>
        </div>

        <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Room Type Modal" className="modal-content-type" overlayClassName="modal-overlay-type">
          <button onClick={closeModal} className="close-icon-type">
            <FaTimes />
          </button>
          <h2 className="modal-title-type">{editingRoomType ? 'Cập nhật loại phòng' : 'Thêm loại phòng mới'}</h2>
          <form onSubmit={handleSubmit} className="modal-form-type">
            <label className='label-text-type'>Mã loại phòng</label>
            <input
              type="text"
              name="IDRoomtype"
              value={form.IDRoomtype}
              onChange={handleChange}
              disabled={!!editingRoomType}
              required
              className="modal-input-type"
            />

            <label className='label-text-type'>Tên loại phòng</label>
            <input
              type="text"
              name="NameRoomtype"
              value={form.NameRoomtype}
              onChange={handleChange}
              required
              className="modal-input-type"
            />

            <label className='label-text-type'>Giá</label>
            <input
              type="number"
              name="PriceRoomtype"
              value={form.PriceRoomtype.toLocaleString('vi-VN')}
              onChange={handleChange}
              required
              className="modal-input-type"
            />

            <label className='label-text-type'>Số người tối đa</label>
            <input
              type="number"
              name="MaxPeople"
              value={form.MaxPeople}
              onChange={handleChange}
              required
              className="modal-input-type"
            />

            <button type="submit" className="modal-submit-button-type">
              {editingRoomType ? 'Cập nhật loại phòng' : 'Thêm loại phòng'}
            </button>
          </form>
        </Modal>

        {/* Bảng hiển thị danh sách loại phòng */}
        <table className="room-table-type">
          <thead>
            <tr>
              <th>Mã loại phòng</th>
              <th>Tên loại phòng</th>
              <th>Giá</th>
              <th>Số người tối đa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((roomtype) => (
              <tr key={roomtype.IDRoomtype}>
                <td>{roomtype.IDRoomtype}</td>
                <td>{roomtype.NameRoomtype}</td>
                <td>{(roomtype.PriceRoomtype.toLocaleString('vi-VN'))}VND</td>
                <td>{roomtype.MaxPeople}</td>
                <td>
                  <div className="icon-buttons-edit-delete">
                    <button
                      onClick={() => handleEdit(roomtype)}
                    >
                      <FaEdit className="icon-edit-delete" />
                    </button>
                    <button
                      onClick={() => handleDelete(roomtype.IDRoomtype)}
                    >
                      <FaTrash className="icon-edit-delete" /> {/* Delete icon */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RoomTypeManager;