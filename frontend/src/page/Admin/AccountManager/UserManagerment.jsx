// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Importing icons

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';

import './UserManager.css'

const AccountManagement = () => {
    const navigate = useNavigate();

    const [activeRole, setActiveRole] = useState("Tất cả");
    const [accounts, setAccounts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [newAccount, setNewAccount] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        branch: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    useEffect(() => {
        fetchAccounts();
        fetchBranches();
    }, [activeRole]);

    // const fetchAccounts = async () => {
    //     try {
    //         const response = await axios.get(
    //             activeRole === "Khách hàng"
    //                 ? "http://localhost:4000/api/user/account/khachhang"
    //                 : "http://localhost:4000/api/user/account/letan"
    //         );
    //         setAccounts(response.data);
    //     } catch (error) {
    //         console.error("Error fetching accounts:", error);
    //     }
    // };

    const fetchAccounts = async () => {
        try {
            let response;
            if (activeRole === "Tất cả") {
                const customers = await axios.get("http://localhost:4000/api/user/account/khachhang");
                const receptionists = await axios.get("http://localhost:4000/api/user/account/letan");
                response = [...customers.data, ...receptionists.data];
            } else {
                const endpoint = activeRole === "Khách hàng"
                    ? "http://localhost:4000/api/user/account/khachhang"
                    : "http://localhost:4000/api/user/account/letan";
                response = (await axios.get(endpoint)).data;
            }
            setAccounts(response);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };


    const fetchBranches = async () => {
        try {
            const response = await axios.get("http://localhost:4000/branch/getallbranch");
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    };

    const handleCreateAccount = async () => {
        try {
            const endpoint = activeRole === "Khách hàng"
                ? "http://localhost:4000/api/user/createUser"
                : "http://localhost:4000/api/user/letan/addnew";
            await axios.post(endpoint, newAccount);
            fetchAccounts();
            resetNewAccount();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    const handleEditAccount = (account) => {
        setAccountToEdit(account);
        setNewAccount({
            name: account.name,
            email: account.email,
            phone: account.phone,
            password: '', // Clear password to avoid showing existing one
            branch: account.branch ? account.branch._id : ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateAccount = async () => {
        try {
            await axios.put(`http://localhost:4000/api/user/updateReceptionist/${accountToEdit._id}`, newAccount);
            fetchAccounts();
            setIsEditModalOpen(false);
            resetNewAccount();
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleDeleteAccount = (account) => {
        setAccountToDelete(account);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/user/deleteReceptionist/${accountToDelete._id}`);
            fetchAccounts();
            setIsDeleteModalOpen(false);
            setAccountToDelete(null);
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const resetNewAccount = () => {
        setNewAccount({
            name: '',
            email: '',
            phone: '',
            password: '',
            branch: ''
        });
    };

    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Quản Lý Tài Khoản</h1>
                <div className="button-group">
                    <button
                        className={`btn-checkin-out ${activeRole === "Tất cả" ? "active" : ""}`}
                        onClick={() => setActiveRole("Tất cả")}>Tất Cả</button>

                    <button
                        className={`btn-checkin-out ${activeRole === "Khách hàng" ? "active" : ""}`}
                        onClick={() => setActiveRole("Khách hàng")}>Khách Hàng</button>
                    <button
                        className={`btn-checkin-out ${activeRole === "Lễ Tân" ? "active" : ""}`}
                        onClick={() => setActiveRole("Lễ Tân")}>Lễ Tân</button>
                </div>

                {/* <h2>Danh sách {activeRole === "Khách Hàng" ? "Khách Hàng" : "Lễ Tân"}</h2> */}
                <div className="add-room-btn-container">
                    <button onClick={() => setIsModalOpen(true)} className="btn-add-room">
                        Thêm tài khoản<span className="plus-icon">+</span>
                    </button>
                </div>
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            {activeRole === "Lễ Tân" && <th>Chi nhánh</th>}
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account._id}>
                                <td>{account.name}</td>
                                <td>{account.email}</td>
                                <td>{account.phone}</td>
                                {activeRole === "Lễ Tân" && <td>{account.branch ? account.branch.branchname : 'Không có'}</td>}
                                <td>
                                    <button onClick={() => handleEditAccount(account)}>
                                        <FaEdit className="icon-edit-delete" />
                                    </button>
                                    {activeRole === "Lễ Tân" && (
                                        <button onClick={() => handleDeleteAccount(account)}>
                                            <FaTrash className="icon-edit-delete" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



                {/* <button onClick={() => setIsModalOpen(true)}>Thêm tài khoản</button> */}

                {/* Modal for creating a new account */}
                <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Thêm tài khoản mới" className="modal-content" overlayClassName="modal-overlay">
                    <button onClick={() => setIsModalOpen(false)} className="close-icon">
                        <FaTimes />
                    </button>
                    <h2 className="modal-title">Tạo tài khoản mới</h2>
                    <div className="new-account-form">
                        <label className='label-text'>Tên</label>
                        <input
                            type="text"
                            name="name"
                            value={newAccount.name}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newAccount.email}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={newAccount.phone}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={newAccount.password}
                            onChange={handleInputChange}
                            className="modal-input"
                        />

                        {activeRole === "Lễ Tân" && (
                            <div>
                                <label className='label-text'>Chi nhánh</label>
                                <select
                                    name="branch"
                                    value={newAccount.branch}
                                    onChange={handleInputChange}
                                    className="modal-input"
                                >
                                    <option value="">Chọn chi nhánh</option>
                                    {branches.map(branch => (
                                        <option key={branch._id} value={branch._id}>{branch.branchname}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button onClick={handleCreateAccount} className="modal-submit-button">Tạo tài khoản</button>
                        {/* <button onClick={() => setIsModalOpen(false)}>Hủy</button> */}
                    </div>
                </Modal>

                {/* Modal for editing an account */}
                <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} contentLabel="Chỉnh sửa tài khoản" className="modal-content" overlayClassName="modal-overlay">
                    <button onClick={() => setIsEditModalOpen(false)} className="close-icon">
                        <FaTimes />
                    </button>
                    <h2 className="modal-title">Chỉnh sửa tài khoản</h2>
                    <div className="new-account-form">
                        <label className='label-text'>Tên</label>
                        <input
                            type="text"
                            name="name"
                            value={newAccount.name}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newAccount.email}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={newAccount.phone}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                        <label className='label-text'>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={newAccount.password}
                            onChange={handleInputChange}
                            className="modal-input"
                        />

                        {activeRole === "Lễ Tân" && (
                            <div>
                                <label className='label-text'>Chi nhánh</label>
                                <select
                                    name="branch"
                                    value={newAccount.branch}
                                    onChange={handleInputChange}
                                    className="modal-input"
                                >
                                    <option value="">Chọn chi nhánh</option>
                                    {branches.map(branch => (
                                        <option key={branch._id} value={branch._id}>{branch.branchname}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button onClick={handleUpdateAccount} className="modal-submit-button">Cập nhật tài khoản</button>
                        {/* <button onClick={() => setIsEditModalOpen(false)}>Hủy</button> */}
                    </div>
                </Modal>

                {/* Modal for delete confirmation */}
                <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} contentLabel="Xác nhận xóa">
                    <h2>Xác nhận xóa tài khoản</h2>
                    <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
                    <button onClick={confirmDeleteAccount}>Xóa</button>
                    <button onClick={() => setIsDeleteModalOpen(false)}>Hủy</button>
                </Modal>
            </div>
        </div>
    );
};

export default AccountManagement;
