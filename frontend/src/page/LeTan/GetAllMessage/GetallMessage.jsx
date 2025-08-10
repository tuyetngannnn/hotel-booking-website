import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./GetallMessage.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Để lọc thư đã đọc và chưa đọc
  const [readCount, setReadCount] = useState(0); // Số lượng thư đã đọc
  const [unreadCount, setUnreadCount] = useState(0); // Số lượng thư chưa đọc
  const [totalCount, setTotalCount] = useState(0); // Tổng số thư
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/message/getall",
          { withCredentials: true }
        );
        if (data.success) {
          setMessages(data.message);
          setTotalCount(data.message.length);
          setReadCount(data.message.filter((msg) => msg.isReplied).length);
          setUnreadCount(data.message.filter((msg) => !msg.isReplied).length);
          toast.success("Messages loaded successfully!");
        } else {
          toast.error("Failed to load messages.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("An error occurred while fetching messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setActiveFilter(newFilter); // Cập nhật trạng thái activeFilter khi nhấn vào mục
  };

  // Hàm tạo đường dẫn email khi nhấn nút trả lời
  const handleReply = async (email, messageId, name) => {
    const subject = "Re: Your Message";
    const body = `Dear ${name},\n\nThank you for your message. I am replying to your inquiry.`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      const response = await axios.put(
        `http://localhost:4000/message/reply/${messageId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, isReplied: true } : msg
          )
        );
        setReadCount(readCount + 1); // Cập nhật số lượng thư đã đọc
        setUnreadCount(unreadCount - 1); // Cập nhật số lượng thư chưa đọc
      } else {
        toast.error("Failed to mark message as replied.");
      }
    } catch (error) {
      console.error("Error replying to message:", error);
      toast.error("An error occurred while replying.");
    }
  };

  // Lọc tin nhắn theo trạng thái đã đọc hay chưa đọc
  const filteredMessages = messages.filter(
    (msg) =>
      filter === "all" ||
      (filter === "read" && msg.isReplied) ||
      (filter === "unread" && !msg.isReplied)
  );

  return (
    <section className="messages-container">
      <h1>HỘP THƯ LIÊN HỆ</h1>
      <div className="messages-layout">
        {/* Thanh điều hướng bên phải */}
        <nav className="messages-nav">
          <ul>
            <li
              onClick={() => handleFilterChange("all")}
              className={activeFilter === "all" ? "active" : ""}
            >
              Tất cả thư ({totalCount})
            </li>
            <li
              onClick={() => handleFilterChange("read")}
              className={activeFilter === "read" ? "active" : ""}
            >
              Thư đã đọc ({readCount})
            </li>
            <li
              onClick={() => handleFilterChange("unread")}
              className={activeFilter === "unread" ? "active" : ""}
            >
              Thư chưa đọc ({unreadCount})
            </li>
          </ul>
        </nav>

        {/* Danh sách tin nhắn bên trái */}
        <div className="messages-list">
          {loading ? (
            <p>Loading messages...</p>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((element) => (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    Tên: <span>{element.name}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Lời nhắn: <span>{element.message}</span>
                  </p>
                  <button
                    onClick={() =>
                      handleReply(element.email, element._id, element.name)
                    }
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy lời nhắn! </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;
