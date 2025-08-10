// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import "react-toastify/dist/ReactToastify.css";
import './EquipmentManagerment.css';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

Modal.setAppElement('#root');

const EquipmentManagement = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [formData, setFormData] = useState({
        IDEquipment: '',
        NameEquiment: '',
        DescribeEquipment: '',
        PriceEquipment: '',
        EquipmentImage: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Fetch equipment list function
    const fetchEquipment = async () => {
        try {
            const response = await axios.get('http://localhost:4000/equipment/getallEquipment1');
            setEquipmentList(response.data.equipment);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thiết bị:', error);
        }
    };

    // Fetch equipment list on component mount
    useEffect(() => {
        fetchEquipment();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image file change
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Add or edit equipment
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('NameEquiment', formData.NameEquiment);
            formDataToSend.append('DescribeEquipment', formData.DescribeEquipment);
            formDataToSend.append('PriceEquipment', formData.PriceEquipment);
            formDataToSend.append('EquipmentImage', imageFile);

            if (isEditing) {
                await axios.put(`http://localhost:4000/equipment/updateequipment/${formData.IDEquipment}`, formDataToSend);
                alert('Cập nhật thiết bị thành công!');
            } else {
                await axios.post('http://localhost:4000/equipment/addequipment', formDataToSend);
                alert('Thêm thiết bị thành công!');
            }
            resetForm();
            await fetchEquipment(); // Update the equipment list
            closeModal(); // Close the modal after adding or editing successfully
        } catch (error) {
            console.error('Lỗi khi thêm/sửa thiết bị:', error);
            alert('Có lỗi xảy ra. Vui lòng kiểm tra lại.');
        }
    };

    // Delete equipment
    const handleDelete = async (ID) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này không?')) {
            try {
                await axios.delete(`http://localhost:4000/equipment/deleteEquipment/${ID}`);
                alert('Xóa thiết bị thành công!');
                await fetchEquipment(); // Update the equipment list
            } catch (error) {
                console.error('Lỗi khi xóa thiết bị:', error);
                alert('Có lỗi xảy ra. Vui lòng kiểm tra lại.');
            }
        }
    };

    // Edit equipment
    const handleEdit = (equipment) => {
        setFormData({
            IDEquipment: equipment._id,
            NameEquiment: equipment.NameEquiment,
            DescribeEquipment: equipment.DescribeEquipment,
            PriceEquipment: equipment.PriceEquipment,
            EquipmentImage: equipment.EquipmentImage,
        });
        setIsEditing(true);
        setImageFile(null);
        openModal(); // Open modal when editing
    };

    // Open modal to add equipment
    const openModal = () => {
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
        resetForm(); // Reset form when closing modal
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            IDEquipment: '',
            NameEquiment: '',
            DescribeEquipment: '',
            PriceEquipment: '',
            EquipmentImage: '',
        });
        setImageFile(null);
        setIsEditing(false);
    };

    return (
        <div className="admin-layout">
            <NavbarAdmin />
            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="tb-manager-content">
                <h1>Quản Lý Thiết Bị</h1>
                <div className="add-tb-btn-container">
                    <button onClick={openModal} className="btn-add-tb">
                        Thêm thiết bị<span className="plus-icon">+</span>
                    </button>
                </div>

                {/* Modal for adding/editing equipment */}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                    <button type="button" onClick={closeModal} className="close-icon">
                        <FaTimes />
                    </button>
                    <h2 className="modal-title">{isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="IDEquipment"
                            value={formData.IDEquipment}
                            className="modal-input"
                        />
                        <label className='label-text'>Tên thiết bị:</label>
                        <input
                            type="text"
                            name="NameEquiment"
                            id="NameEquiment"
                            value={formData.NameEquiment}
                            onChange={handleChange}
                            required
                            className="modal-input" />
                        <label className='label-text'>Mô tả:</label>
                        <textarea
                            name="DescribeEquipment"
                            id="DescribeEquipment"
                            value={formData.DescribeEquipment}
                            onChange={handleChange}
                            required
                            className="modal-input" />
                        <label className='label-text'>Giá:</label>
                        <input
                            type="number"
                            id="PriceEquipment"
                            name="PriceEquipment"
                            value={formData.PriceEquipment}
                            onChange={handleChange}
                            required
                            className="modal-input" />
                        <label className='label-text'>Tải lên ảnh thiết bị:</label>
                        <input
                            type="file"
                            id="EquipmentImage"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImageChange}
                        />
                        {isEditing && formData.EquipmentImage && (
                            <img
                                src={formData.EquipmentImage?.[0].url}
                                alt={formData.NameEquipment}
                                className="mt-2 w-20 h-20 object-cover rounded"
                            />
                        )}
                        <button
                            type="submit"
                            className="modal-submit-button"
                        >
                            {isEditing ? 'Cập nhật thiết bị' : 'Thêm thiết bị'}
                        </button>
                    </form>
                </Modal>

                <table className="tb-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên Thiết Bị</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipmentList.map((equipment) => (
                            <tr key={equipment._id}>
                                <td>
                                    <img
                                        src={equipment.EquipmentImage?.[0].url}
                                        alt={equipment.NameEquiment}
                                        style={{ width: '100px', height: 'auto', marginBottom: '10px', justifyContent: 'center' }}
                                    />
                                </td>
                                <td>{equipment.NameEquiment}</td>
                                <td>{equipment.DescribeEquipment}</td>
                                <td>{equipment.PriceEquipment.toLocaleString('vi-VN') } VNĐ</td>
                                <td>
                                    <div className="icon-buttons-edit-delete">
                                        <button onClick={() => handleEdit(equipment)}>
                                            <FaEdit className="icon-edit-delete" />
                                        </button>
                                        <button onClick={() => handleDelete(equipment._id)}>
                                            <FaTrash className="icon-edit-delete" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EquipmentManagement;
