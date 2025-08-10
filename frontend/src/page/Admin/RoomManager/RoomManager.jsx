// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './RoomManager.css'
// eslint-disable-next-line no-unused-vars
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Importing icons


import NavbarAdmin from '../../../components/Navbar/NavbarAdmin';
import Account from '../../../components/Account/Account';


const RoomManager = () => {
    const [rooms, setRooms] = useState([]);
    //const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [currentRoom, setCurrentRoom] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    // const [image, setImage] = useState(null);
    const [images, setImages] = useState([]); // Sử dụng để lưu nhiều ảnh
    const [isOpen, setIsOpen] = useState(false);
    const uniqueBranches = [...new Map(rooms.map(room => [room.IDBranch._id, room.IDBranch])).values()];
    const uniqueRoomTypes = [...new Map(rooms.map(room => [room.IDRoomType._id, room.IDRoomType])).values()];


    // Fetch rooms from API
    const fetchRooms = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/room/getallroom`);
            setRooms(response.data.rooms || []); // Ensure it's an array
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            await fetchRooms();
            //setLoading(false);
        };
        fetchData();
    }, []);


    // Thêm phòng mới
    const addRoom = async () => {
        const formData = new FormData();
       
        // Kiểm tra và thêm thông tin vào formData
        const { NumberofRoom, NameRoom, Describe, IDBranch, IDRoomType, acreage } = currentRoom;
   
        if (!NumberofRoom || !NameRoom || !acreage || !IDBranch || !IDRoomType) {
            setError("Tất cả các trường đều bắt buộc!");
            return;
        }
   
        formData.append('NumberofRoom', NumberofRoom);
        formData.append('NameRoom', NameRoom);
        formData.append('Describe', Describe);
        formData.append('IDBranch', IDBranch);
        formData.append('IDRoomType', IDRoomType);
        formData.append('acreage', acreage);
   
        // Thêm tất cả ảnh vào formData
        images.forEach(image => {
            formData.append('RoomImages', image);
        });
   
        if (images.length === 0) {
            setError("Bạn chưa tải ảnh lên.");
            return;
        }
        console.log("Current Room Data:", IDBranch);
        console.log("Images Array:", IDRoomType);
       
        // Ghi log nội dung formData để kiểm tra
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
   
        console.log('ketqua',formData);
        try {
            const response = await axios.post(`http://localhost:4000/room/addroom`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
   
            // Kiểm tra phản hồi từ server
            if (response.data && response.data.room) {
                setRooms([...rooms, response.data.room]);
                toast.success("Thêm phòng thành công!");
                resetForm();
                closeModal();
            } else {
                toast.error("Thêm phòng thất bại, không có dữ liệu trả về.");
            }
        } catch (error) {
            setError("Lỗi: " + (error.response?.data?.message || error.message));
            console.error("Error adding room:", error.response ? error.response.data : error.message); // Ghi log chi tiết lỗi
        }
    };
   




    // Xóa phòng
    // const deleteRoom = async (idroom) => {
    //     const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    //     if (confirmDelete) {
    //         try {
    //             await axios.delete(`http://localhost:4000/room/deleteroom/${idroom}`);
    //             setRooms(rooms.filter((room) => room._id !== idroom));
    //         } catch (err) {
    //             setError(err.message);
    //         }
    //     }
    // };






    // Sửa thông tin phòng
    const editRoom = async () => {
        const formData = new FormData();
        formData.append('NumberofRoom', currentRoom.NumberofRoom);
        formData.append('NameRoom', currentRoom.NameRoom);
        formData.append('Describe', currentRoom.Describe);
        formData.append('IDBranch', currentRoom.IDBranch);
        formData.append('IDRoomType', currentRoom.IDRoomType);
        formData.append('acreage', currentRoom.acreage);
        // if (image) formData.append('RoomImages', image);


        // Thêm tất cả ảnh vào formData
        images.forEach(image => {
            formData.append('RoomImages', image);
        });


        try {
            const response = await axios.put(`http://localhost:4000/room/updateroom/${currentRoom._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });


            // Cập nhật danh sách phòng với phòng đã được cập nhật
            setRooms(rooms.map((room) => (room._id === currentRoom._id ? response.data.room : room)));
            toast.success('Phòng đã được cập nhật thành công.'); // Hiện thông báo thành công
            resetForm();
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };


    const handleSave = () => {
        isEditing ? editRoom() : addRoom();
    };


    const resetForm = () => {
        setCurrentRoom({});
        // setImage(null);
        setImages([]); // Đặt lại ảnh đã chọn
        setIsEditing(false);
    };


    const openModal = () => {
        setIsOpen(true);
        setIsEditing(false);
        resetForm();
    };


    const closeModal = () => {
        setIsOpen(false);
        resetForm();
    };
    const openEditModal = (room) => {
        setCurrentRoom(room);
        setIsEditing(true);
        setIsOpen(true);
        setImages([]);
    };
    // if (loading) return <div>Đang tải...</div>;
    // if (error) return <div>Lỗi: {error}</div>;


    return (
        <div className="admin-layout">
            <NavbarAdmin />

            <div className="top-bar-admin">
                <Account />
            </div>
            <div className="room-manager-content">
                <h1>Quản Lý Phòng</h1>
                <div className="add-room-btn-container">
                    <button onClick={openModal} className="btn-add-room">
                        Thêm phòng<span className="plus-icon">+</span>
                    </button>
                </div>
                {/*Hiện dialog thêm mới hoặc sửa phòng*/}
                <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                    <button onClick={closeModal} className="close-icon">
                        <FaTimes />
                    </button>
                    <h2 className="modal-title">{isEditing ? 'Cập Nhật Phòng' : 'Thêm Phòng'}</h2>
                    <label className='label-text'>Số phòng</label>
                    <input
                        type="text"
                        // placeholder="Số Phòng"
                        value={currentRoom.NumberofRoom || ''}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, NumberofRoom: e.target.value })}
                        className="modal-input"
                        maxLength={4}
                    />
                    <label className='label-text'>Tên phòng</label>
                    <input
                        type="text"
                        // placeholder="Tên Phòng"
                        value={currentRoom.NameRoom || ''}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, NameRoom: e.target.value })}
                        className="modal-input"
                    />
                    <label className='label-text'>Mô tả</label>
                    <input
                        type="text"
                        // placeholder="Mô Tả"
                        value={currentRoom.Describe || ''}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, Describe: e.target.value })}
                        className="modal-input"
                    />
                    <label className='label-text'>Diện tích</label>
                    <input
                        type="Number"
                        // placeholder="Diện tích"
                        value={currentRoom.acreage || ''}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, acreage: e.target.value })}
                        className="modal-input"
                    />
                    {/* Thay vì fetchBranches và fetchRoomTypes, sử dụng các ID trực tiếp */}


                    <label className='label-text'>Chọn chi nhánh</label>
                    <select
                        onChange={(e) => setCurrentRoom({ ...currentRoom, IDBranch: e.target.value })}
                        value={currentRoom.IDBranch || ''}
                        className="modal-input">


                        {uniqueBranches.map((branch) => (
                            <option key={branch._id} value={branch._id}>{branch.branchname}</option>
                        ))}
                    </select>


                    <label className='label-text'>Chọn loại phòng</label>
                    <select
                        onChange={(e) => setCurrentRoom({ ...currentRoom, IDRoomType: e.target.value })}
                        value={currentRoom.IDRoomType || ''}
                        className="modal-input">


                        {uniqueRoomTypes.map((roomType) => (
                            <option key={roomType._id} value={roomType._id}>{roomType.NameRoomtype}</option>
                        ))}
                    </select>


                    <label className='label-text'>Ảnh phòng</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        // onChange={(e) => setImage(e.target.files[0])}
                        onChange={(e) => setImages(Array.from(e.target.files))} // Đặt hình ảnh thành các tệp được chọn                        multiple
                    />
                    {isEditing && currentRoom.RoomImages && (
                        <div>
                            <h3>Ảnh hiện có:</h3>
                            {/* <img src={currentRoom.RoomImages} alt="Room" style={{ width: '100px', height: 'auto' }} /> */}
                            {currentRoom.RoomImages.map((image, index) => (
                                <img key={index} src={image.url} alt={`Room ${index + 1}`} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
                            ))}
                        </div>
                    )}
                    {/* Hiển thị các hình ảnh đã chọn */}
                    <div>
                        {images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Selected Room ${index + 1}`} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
                        ))}
                    </div>
                    <button onClick={handleSave} className="modal-submit-button">{isEditing ? 'Cập Nhật' : 'Thêm Phòng'}</button>
                    {/* <button onClick={closeModal}>Đóng</button> */}
                </Modal>




                <table className="room-table">
                    <thead>
                        <tr>
                            <th>Số Phòng</th>
                            <th>Tên Phòng</th>
                            <th>Mô Tả</th>
                            <th>Chi Nhánh</th>
                            <th>Loại Phòng</th>
                            <th>Diện tích</th>
                            <th>Ảnh</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id}>
                                <td>{room.NumberofRoom}</td>
                                <td>{room.NameRoom}</td>
                                <td>{room.Describe}</td>
                                <td>{room.IDBranch.branchname}</td>
                                <td>{room.IDRoomType.NameRoomtype}</td>
                                <td>{room.acreage} m²</td>
                                <td>
                                    {room.RoomImages && (
                                        <div>
                                            {room.RoomImages.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.url}
                                                    alt={`Room ${index + 1}`}
                                                    style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="icon-buttons-edit-delete">
                                        <button onClick={() => { setCurrentRoom(room); setIsEditing(true); openModal();openEditModal(room) }}>
                                            <FaEdit className="icon-edit-delete" /> {/* Edit icon */}
                                        </button>
                                        {/* <button onClick={() => deleteRoom(room._id)}>
                                            <FaTrash className="icon-edit-delete" /> 
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer/>
        </div>
    );
};


export default RoomManager;