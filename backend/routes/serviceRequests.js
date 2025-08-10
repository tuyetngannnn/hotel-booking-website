// routes/serviceRequests.js
import express from 'express';
import {
    createServiceRequest,
    getServiceRequests,
    acceptServiceRequest,
    getServiceRequests1,
    getServiceRequestsDetail,
    cancelServiceRequest,
    getServiceRequests2,
    cancelServiceRequest1,
} from '../controllers/serviceRequestController.js';

const ServiceRequestRouter = express.Router();
// Tạo yêu cầu thêm dịch vụ
ServiceRequestRouter.post('/create', createServiceRequest);
// Lấy danh sách yêu cầu
ServiceRequestRouter.get('/get', getServiceRequests);
// Lấy danh sách yêu cầu chưa xác nhận
ServiceRequestRouter.get('/get1', getServiceRequests1);
//Lấy danh sách theo khách hàng
ServiceRequestRouter.get('/get/:id', getServiceRequests2);
//Lấy dữ liệu dự trên id
ServiceRequestRouter.get('/getdetail/:id', getServiceRequestsDetail);
// Xác nhận yêu cầu
ServiceRequestRouter.put('/:id/accept', acceptServiceRequest);
//Hủy yêu cầu
ServiceRequestRouter.put('/:id/cancel', cancelServiceRequest);
// Hủy yêu cầu (xóa yêu cầu)
ServiceRequestRouter.delete('/:id/cancel1', cancelServiceRequest1);

const ServiceRequestRoute = (app) => {
    app.use('/serviceRequests', ServiceRequestRouter); 
};

export default ServiceRequestRoute;
