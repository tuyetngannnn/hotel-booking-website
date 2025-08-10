import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchContext } from "../../components/Search/SearchContext";
import './Search.css';

const SearchCard = () => {
    const { searchResults, isSearchExecuted, searchId } = useContext(SearchContext);
    const [fetchedRoomDetails, setFetchedRoomDetails] = useState([]);
    const [currentSearchId, setCurrentSearchId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!Array.isArray(searchResults) || searchResults.length === 0) return;

            try {
                const roomIds = searchResults.map((room) => room._id);
                const uniqueRoomIds = [...new Set(roomIds)]; // Ensure unique room IDs

                const roomDetailsPromises = uniqueRoomIds.map((roomId) =>
                    axios.get(`http://localhost:4000/room/roomdetail/${roomId}`)
                );

                const responses = await Promise.all(roomDetailsPromises);
                const roomsData = responses.map((response) => response.data);

                // Set unique room details to avoid duplicates
                const uniqueRoomsData = Array.from(new Set(roomsData.map(a => a._id)))
                    .map(id => roomsData.find(a => a._id === id));
                
                setFetchedRoomDetails(uniqueRoomsData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin chi tiết phòng:', error);
            }
        };

        if (isSearchExecuted && searchId !== currentSearchId) {
            setFetchedRoomDetails([]);
            setCurrentSearchId(searchId);
            fetchRoomDetails();
        }
    }, [isSearchExecuted, searchResults, searchId, currentSearchId]);

    const handleViewDetails = (roomId) => {
        navigate(`/roomdetail/${roomId}`);
    };

    return (
        <div>
            {isSearchExecuted && fetchedRoomDetails.length > 0 ? (
                <div className="body-room">
                    <h1 className="text-content-body-1">Kết quả tìm kiếm</h1>
                    <div className="kq-room-grid">
                        {fetchedRoomDetails.map((room) => (
                            <div key={room._id} className="kq-room-item">
                                {room.RoomImages?.length > 0 ? (
                                    <img src={room.RoomImages[0].url} alt={room.NameRoom} className="kq-room-image" />
                                ) : (
                                    <p>Không có hình ảnh</p>
                                )}
                                <h3 className="kq-room-title">{room.NameRoom}</h3>
                                <p className="kq-room-description">
                                    {room.Describe || 'Mô tả không có'}
                                </p>
                                <p className="kq-room-info">{room.IDRoomType?.MaxPeople} Khách | {room.IDBranch?.branchname} | {room.acreage} m²</p>
                                {/* <p className="kq-room-info">Diện tích: {room.acreage} m²</p>
                                <p className="kq-room-info">Số khách tối đa: {room.IDRoomType?.MaxPeople || 'Thông tin không có'}</p> */}
                                <p className="kq-room-info" style={{fontWeight: '700', fontSize: '22px'}}>Giá: {room.IDRoomType?.PriceRoomtype?.toLocaleString() || 'Thông tin không có'} VND</p>
                                <button className="kq-book-button" onClick={() => handleViewDetails(room._id)}>
                                    ĐẶT CHỖ
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : isSearchExecuted ? (
                <div className="body-room">
                    <h1 className="text-content-body-1">Kết quả tìm kiếm</h1>
                    <p>Không tìm thấy kết quả nào.</p>
                </div>
            ) : null}
        </div>
    );
};

export default SearchCard;
