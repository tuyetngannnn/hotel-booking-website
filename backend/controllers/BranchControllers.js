import Branch  from"../models/chinhanh.js";

// Phương thức để tạo các chi nhánh mặc định
export const createDefaultBranches = async (req, res) => {
  console.log("Gọi phương thức tạo chi nhánh mặc định");
    const branches = [
      { branchname: 'CN Tân Bình', branchlocation: '32 Trường Sơn, Phường 2, Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam.' },
      { branchname: 'CN Hóc Môn', branchlocation: '806 QL22, ấp Mỹ Hòa 3, Quận Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam.' },
      { branchname: 'CN Sư Vạn Hạnh', branchlocation: '828 Sư Vạn Hạnh, Phường 13, Quận 10, Thành phố Hồ Chí Minh, Việt Nam.' },
    ];
  
    try {
      for (const branch of branches) {
        const existingBranch = await Branch.findOne({ branchname: branch.branchname }); // Sửa lại tên trường
        if (!existingBranch) {
          await Branch.create(branch);
          console.log(`Đã tạo chi nhánh: ${branch.branchname}`); // Sửa lại tên trường
        } else {
          console.log(`Chi nhánh ${branch.branchname} đã tồn tại.`);
        }
      }
      res.status(201).json({ message: 'Các chi nhánh mặc định đã được tạo hoặc đã tồn tại.' });
    } catch (error) {
      console.error('Lỗi khi tạo chi nhánh:', error);
      res.status(500).json({ message: 'Lỗi khi tạo chi nhánh.', error });
    }
  };

  //Thêm chi nhánh
export const addBranch = async (req, res) => {
    const { branchname, branchlocation } = req.body;
    console.log('Received data:', req.body);
    // Kiểm tra nếu tên chi nhánh hoặc địa điểm để trống
    if (!branchname || !branchlocation) {
      return res.status(400).json({ message: 'Tên chi nhánh và địa điểm không được để trống.' });
    }
  
    try {
      // Kiểm tra xem chi nhánh đã tồn tại chưa
      const existingBranch = await Branch.findOne({ branchname });
      if (existingBranch) {
        return res.status(400).json({ message: 'Chi nhánh đã tồn tại.' });
      }
  
      // Tạo chi nhánh mới
      const newBranch = await Branch.create({ branchname, branchlocation });
      res.status(201).json({ message: 'Chi nhánh đã được thêm thành công.', branch: newBranch });
    } catch (error) {
      console.error('Lỗi khi thêm chi nhánh:', error);
      res.status(500).json({ message: 'Lỗi khi thêm chi nhánh.', error });
    }
  };

  //Sửa thông tin chi nhánh
  export const updateBranch = async (req, res) => {
    const { branchId } = req.params; 
    const { branchname, branchlocation } = req.body; 
  
    try {
    
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ message: 'Chi nhánh không tồn tại.' });
      }
  
    
      if (branchname) branch.branchname = branchname;
      if (branchlocation) branch.branchlocation = branchlocation;
  
      const updatedBranch = await branch.save(); 
      res.status(200).json({ message: 'Chi nhánh đã được cập nhật thành công.', branch: updatedBranch });
    } catch (error) {
      console.error('Lỗi khi cập nhật chi nhánh:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật chi nhánh.', error });
    }
  };

  //Xóa chi nhánh
  export const deleteBranch = async (req, res) => {
    const { branchId } = req.params; 
  
    try {
     
      const deletedBranch = await Branch.findByIdAndDelete(branchId);
      if (!deletedBranch) {
        return res.status(404).json({ message: 'Chi nhánh không tồn tại.' });
      }
      
      res.status(200).json({ message: 'Chi nhánh đã được xóa thành công.', branch: deletedBranch });
    } catch (error) {
      console.error('Lỗi khi xóa chi nhánh:', error);
      res.status(500).json({ message: 'Lỗi khi xóa chi nhánh.', error });
    }
  };



  //Lấy danh sách chi nhánh 
  export const getallBranch = async (req, res) => {
    try {
      
        const allBranch = await Branch.find();

        res.status(200).json(allBranch);
    } catch (error) {
        console.error('Lỗi khi lấy tất cả chi nhánh khách sạn:', error);
        res.status(500).json({ message: 'Lỗi khi lấy tất cả chi nhánh khách sạn.', error });
    }
};
  