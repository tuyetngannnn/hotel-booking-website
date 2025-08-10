// eslint-disable-next-line no-unused-vars
import React ,{ useState, useEffect } from 'react'
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Importing icons

const ProfileAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    const userId = localStorage.getItem('userId');
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/profileAdmin/${userId}`);
        const { name, email, phone, birthday, gender } = response.data;
        setName(name);
        setEmail(email);
        setPhone(phone);
        setBirthday(birthday ? birthday.split('T')[0] : ''); // Chuẩn hóa định dạng ngày
        setGender(gender);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error.message);
        alert("Không thể tải thông tin người dùng");
      }
    };
  
    useEffect(() => {
      if (!userId) {
        alert("Không có thông tin người dùng");
        return;
      }
      fetchUserData();
    }, [userId]);
  
    const handleSave = async () => {
      const today = new Date();
      const birthDate = new Date(birthday);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
  
      if (age < 18 || (age === 18 && monthDifference < 0)) {
        alert("Bạn phải từ 18 tuổi trở lên.");
        return;
      }
  
      try {
        const updatedUserData = { name, email, phone, birthday, gender };
  
        await axios.put(`http://localhost:4000/api/user/updateprofileAdmin/${userId}`, updatedUserData);
  
        alert("Thông tin đã được cập nhật thành công");
        setIsDialogOpen(false);
        await fetchUserData();
      } catch (error) {
        console.error("Error updating user data:", error.response || error.message);
        alert("Có lỗi xảy ra khi cập nhật thông tin");
      }
    };
  
    return (
      <div>
     
        <div className="profile-tittle">THÔNG TIN NGƯỜI DÙNG</div>
        <div className='body-profile'>
          <div className="form-group-profile">
            <label>Tên người dùng</label>
            <div className="profile-info full-width">{name}</div>
          </div>
  
          <div className="form-row">
            <div className="form-group-profile half-width">
              <label>Email</label>
              <div className="profile-info">{email}</div>
            </div>
  
            <div className="form-group-profile half-width">
              <label>Số điện thoại</label>
              <div className="profile-info">{phone}</div>
            </div>
          </div>
  
          <div className="form-row">
            <div className="form-group-profile half-width">
              <label>Ngày sinh</label>
              <div className="profile-info">{birthday ? new Date(birthday).toLocaleDateString() : ''}</div>
            </div>
  
            <div className="form-group-profile half-width">
              <label>Giới tính</label>
              <div className="profile-info">{gender}</div>
            </div>
          </div>
  
          <div className='edit-content'>
            <button onClick={() => setIsDialogOpen(true)} className='btn-edit-profile'>Chỉnh sửa</button>
          </div>
          {isDialogOpen && (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button onClick={() => setIsDialogOpen(false)} className="close-icon">
          <FaTimes />
        </button>
        <div className="dialog-title">Chỉnh sửa thông tin</div>
        <input
          label="Tên"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="dialog-input"
        />
        <input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dialog-input"
        />
        <input
          label="Số điện thoại"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="dialog-input"
        />
        <input
          label="Ngày sinh"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="dialog-input date-input"
        />
        <select
          value={gender || ''}
          onChange={(e) => setGender(e.target.value)}
          label="Giới tính"
          className="dialog-input"
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <button onClick={handleSave} className="dialog-submit-button">Lưu</button>
      </div>
    </div>
  )}
  
        </div>
       
      </div>
    );
  };
  
  export default ProfileAdmin;
  
