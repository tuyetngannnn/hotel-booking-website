import User from "../models/user.model.js";
import asyncHandler from 'express-async-handler';

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin người dùng' });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, birthday, gender } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.birthday = birthday || user.birthday;
    user.gender = gender || user.gender;

    await user.save();

    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
  }
});


export const getProfileAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải thông tin người dùng' });
  }
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, birthday, gender } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.birthday = birthday || user.birthday;
    user.gender = gender || user.gender;

    await user.save();

    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
  }
});
