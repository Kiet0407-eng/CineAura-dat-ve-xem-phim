-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 21, 2026 lúc 03:26 AM
-- Phiên bản máy phục vụ: 11.2.5-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cineaura_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `showtime_id` int(11) DEFAULT NULL,
  `seats` varchar(255) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PAID','CANCELLED') DEFAULT 'PENDING',
  `booking_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `showtime_id`, `seats`, `total_price`, `status`, `booking_date`) VALUES
(9, 1, 7, 'C-3', 200000.00, 'PAID', '2026-06-12 08:16:46'),
(10, 1, 7, 'C-4', 200000.00, 'PAID', '2026-06-12 09:27:40'),
(26, 2, 8, 'F-3', 144000.00, 'PAID', '2026-06-19 09:11:29'),
(27, 1, 8, 'E-4', 225000.00, 'PAID', '2026-06-20 21:03:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `foods`
--

CREATE TABLE `foods` (
  `id` varchar(50) NOT NULL,
  `tenDoAn` varchar(255) NOT NULL,
  `loai` varchar(50) NOT NULL,
  `gia` int(11) NOT NULL,
  `hinhAnh` text DEFAULT NULL,
  `moTa` text DEFAULT NULL,
  `banChay` tinyint(1) DEFAULT 0,
  `trangThai` varchar(50) DEFAULT 'CON_HANG'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `foods`
--

INSERT INTO `foods` (`id`, `tenDoAn`, `loai`, `gia`, `hinhAnh`, `moTa`, `banChay`, `trangThai`) VALUES
('F1781545230596', 'bắp nước', 'COMBO', 50000, '', '111111', 1, 'CON_HANG');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `genres`
--

INSERT INTO `genres` (`id`, `name`, `description`) VALUES
(1, 'Hành động, Bom tấn', 'Kịch tính, đua xe, đấu võ và các màn rượt đuổi mạo hiểm.'),
(2, 'Tình cảm, Lãng mạn', 'Lãng mạn, chiều sâu tâm lý nhân vật và các tình huống xúc động.'),
(3, 'Kinh dị, Hồi hộp', 'Sử dụng các yếu tố rùng rợn, giật gân, bí ẩn siêu nhiên.'),
(4, 'Hài hước, Gia đình', 'Phim giải trí nhẹ nhàng, mang lại tiếng cười cho mọi lứa tuổi.'),
(5, 'Khoa học viễn tưởng', 'Công nghệ tương lai, hành trình du hành không gian và dải ngân hà.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'Thời lượng tính bằng phút',
  `genre` varchar(100) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `status` enum('NOW_SHOWING','COMING_SOON') DEFAULT 'NOW_SHOWING',
  `director` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT 9,
  `format` varchar(50) DEFAULT '2D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `poster_url`, `trailer_url`, `duration`, `genre`, `release_date`, `status`, `director`, `rating`, `format`) VALUES
(4, 'Người Sói', '', 'http://localhost:8080/cineaura-backend/uploads/1780561202_phim-nguoi-soi-6.jpg', 'https://www.youtube.com/watch?v=m8k1n_lFyEg', 157, 'Chưa phân loại', '2026-06-12', 'NOW_SHOWING', NULL, 9, '2D'),
(5, 'Deadpool & Wolverine', 'Deadpool và Wolverine là một bộ phim siêu anh hùng hài hước của Mỹ dựa trên nhân vật Deadpool của Marvel Comics, bộ phim được sản xuất bởi Marvel Studios và Maximum Effort và được phân phối bởi Walt Disney Studios Motion Pictures. Phim được dự định là bộ phim thứ 34 trong Vũ trụ Điện ảnh Marvel (MCU) và là phần tiếp theo của 2 phần phim thuộc 20th Century Fox: Deadpool (2016) và Deadpool 2 (2018). Bộ phim được đạo diễn bởi Shawn Levy, được viết bởi nhóm biên kịch Rhett Reese và Paul Wernick cùng với Zeb Wells, Ryan Reynolds và Levy. Reynolds đóng vai Wade Wilson / Deadpool cùng với Hugh Jackman, Morena Baccarin và Brianna Hildebrand.', 'http://localhost:8080/cineaura-backend/uploads/1781005690_wallpapersden.com_deadpool-and-wolverine-digital-poster_1920x1080.jpg', 'https://www.youtube.com/watch?v=qVoN8v71I8I', 127, 'Hành động, Bom tấn', '2026-06-12', 'NOW_SHOWING', 'Shawn Levy', 8.9, '2D'),
(7, 'Interstellar (Hố Đen Tử Thần)', 'Một nhóm nhà thám hiểm vũ trụ đi qua một lỗ sâu (wormhole) để tìm kiếm hành tinh mới có thể sinh sống được cho nhân loại đang đứng bên bờ vực diệt vong.', 'http://localhost:8080/cineaura-backend/uploads/1781986687_Interstellar_poster.jpg', 'https://www.youtube.com/watch?v=QqSp_dwslro', 169, 'Khoa học viễn tưởng', '2026-06-21', 'NOW_SHOWING', 'Christopher Nolan', 8.7, 'IMAX'),
(8, 'Avengers: Endgame (Hồi Kết)', 'Biệt đội siêu anh hùng Avengers tập hợp lần cuối để đảo ngược thảm họa do Thanos gây ra và khôi phục lại trật tự cho toàn vũ trụ.', 'http://localhost:8080/cineaura-backend/uploads/1781987467_avengers-endgame-2019-official-poster-th.jpg', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 181, 'Hành động, Bom tấn', '2026-06-21', 'NOW_SHOWING', 'Anthony & Joe Russo', 9.9, 'IMAX'),
(9, 'Avatar: The Way of Water (Dòng Chảy Của Nước)', 'Jake Sully và gia đình phải rời bỏ quê hương rừng sâu để khám phá các đại dương trên Pandora, đồng thời đối mặt với sự trở lại của người Trái Đất.', 'http://localhost:8080/cineaura-backend/uploads/1781987608_OIP.jpg', 'https://www.youtube.com/watch?v=q3dPNyAlCeY', 192, 'Khoa học viễn tưởng', '2026-06-21', 'NOW_SHOWING', 'James Cameron', 9, '3D'),
(10, 'Oppenheimer', 'Cuộc đời và những giằng xé nội tâm của J. Robert Oppenheimer - cha đẻ của bom nguyên tử, người đã thay đổi cục diện Chiến tranh thế giới thứ hai.', 'http://localhost:8080/cineaura-backend/uploads/1781987715_OIP (1).jpg', 'https://www.youtube.com/watch?v=bK6ldnjE3Y0', 180, 'Khoa học viễn tưởng', NULL, 'NOW_SHOWING', 'Christopher Nolan', 9, 'IMAX'),
(11, 'Dune: Part Two (Hành Tinh Cát - Phần 2)', 'Paul Atreides liên minh cùng người Fremen trên hành tinh sa mạc Arrakis để trả thù những kẻ đã hủy hoại gia tộc mình.', 'http://localhost:8080/cineaura-backend/uploads/1781987810_OIP (2).jpg', 'https://www.youtube.com/watch?v=xwZ4ToJWAeo', 166, 'Hành động, Bom tấn', '2026-06-21', 'NOW_SHOWING', 'Denis Villeneuve', 9, 'IMAX'),
(12, 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)', 'Bước vào tuổi dậy thì, tâm trí Riley xuất hiện thêm những cảm xúc hoàn toàn mới, đặc biệt là Lo Âu (Anxiety), gây ra vô vàn rắc rối.', 'http://localhost:8080/cineaura-backend/uploads/1781988000_OIP (3).jpg', 'https://www.youtube.com/watch?v=2l2lHgg-FK8', 96, 'Hài hước, Gia đình', '2026-06-21', 'NOW_SHOWING', 'Kelsey Mann', 9, '2D'),
(13, 'Godzilla x Kong: Đế Chế Mới', 'Hai Titan vĩ đại Kong và Godzilla buộc phải gác lại hiềm khích để đối đầu với một mối đe dọa khổng lồ ẩn sâu trong Trái Đất Rỗng.', 'http://localhost:8080/cineaura-backend/uploads/1781988077_OIP (4).jpg', 'https://www.youtube.com/watch?v=5XkgG_AAQs0', 115, 'Hài hước, Gia đình', '2026-06-21', 'NOW_SHOWING', 'Adam Wingard', 9, 'IMAX'),
(14, 'John Wick: Chapter 4', 'John Wick tìm ra con đường đánh bại The High Table để giành lại tự do, nhưng anh phải đối mặt với một kẻ thù mới có quyền lực vươn ra toàn cầu.', 'http://localhost:8080/cineaura-backend/uploads/1781988216_OIP (5).jpg', 'https://www.youtube.com/watch?v=qEVUtrk8_B4', 169, 'Hài hước, Gia đình', '2026-06-21', 'NOW_SHOWING', 'Chad Stahelski', 9, '2D'),
(15, 'Spider-Man: Across the Spider-Verse', 'Miles Morales du hành qua đa vũ trụ, gặp gỡ tổ chức Người Nhện do Miguel O\'Hara lãnh đạo và nhận ra mình phải đối đầu với chính họ để bảo vệ người thân.', 'http://localhost:8080/cineaura-backend/uploads/1781988305_OIP (6).jpg', 'https://www.youtube.com/watch?v=cqGjhVJWtEg', 140, 'Hài hước, Gia đình', '2026-06-21', 'NOW_SHOWING', 'Joaquim Dos Santos', 9, '3D'),
(16, 'Lật Mặt 7: Một Điều Ước', 'Câu chuyện cảm động về tình mẫu tử, khi bà Hai lâm bệnh nặng nhưng các con đều bận rộn mưu sinh, hé lộ những góc khuất trong cuộc sống gia đình hiện đại.', '', '', 138, 'Hài hước, Gia đình', NULL, 'COMING_SOON', 'Lý Hải', 9, 'IMAX');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

CREATE TABLE `promotions` (
  `code` varchar(50) NOT NULL,
  `loaiGiam` varchar(50) NOT NULL,
  `mucGiam` int(11) NOT NULL,
  `conditional_min` int(11) NOT NULL,
  `hanDung` date NOT NULL,
  `trangThai` varchar(50) DEFAULT 'HOAT_DONG'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `promotions`
--

INSERT INTO `promotions` (`code`, `loaiGiam`, `mucGiam`, `conditional_min`, `hanDung`, `trangThai`) VALUES
('KHUYENMAI', 'PERCENT', 10, 100000, '2026-07-04', 'HOAT_DONG');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `theater_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `format` varchar(20) DEFAULT '2D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `theater_id`, `name`, `capacity`, `format`) VALUES
(1, 2, 'Phòng 1 - IMAX', 120, 'IMAX');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `seat_name` varchar(10) NOT NULL,
  `seat_type` enum('STANDARD','VIP') DEFAULT 'STANDARD'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seat_types`
--

CREATE TABLE `seat_types` (
  `id` varchar(50) NOT NULL,
  `tenLoai` varchar(100) NOT NULL,
  `phuThu` int(11) NOT NULL DEFAULT 0,
  `moTa` text DEFAULT NULL,
  `mauSac` varchar(20) DEFAULT 'gray'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `seat_types`
--

INSERT INTO `seat_types` (`id`, `tenLoai`, `phuThu`, `moTa`, `mauSac`) VALUES
('NORMAL', 'Ghế Thường', 0, 'Ghế nệm tiêu chuẩn, đặt tại các hàng đầu và hai bên hông.', 'gray'),
('SWEETBOX', 'Ghế Đôi (Sweetbox)', 90000, 'Ghế sofa đôi riêng tư, thiết kế có vách ngăn ở hàng cuối.', 'pink'),
('VIP', 'Ghế VIP Gold', 40000, 'Vị trí trung tâm rạp, góc nhìn màn hình và âm thanh tốt nhất.', 'red');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `showtimes`
--

INSERT INTO `showtimes` (`id`, `movie_id`, `room_id`, `show_date`, `show_time`, `price`) VALUES
(7, 5, 1, '2026-06-19', '20:00:00', 160000.00),
(8, 4, 1, '2026-06-22', '19:00:00', 160000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theaters`
--

CREATE TABLE `theaters` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `theaters`
--

INSERT INTO `theaters` (`id`, `name`, `address`, `city`) VALUES
(2, 'CineAura Đà Nẵng', 'Tầng 4 Vincom Plaza, 910A Ngô Quyền', 'Đà Nẵng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `avatar`, `password`, `phone`, `role`, `created_at`) VALUES
(1, 'Thế Kiệt', 'kiet31544@gmail.com', 'http://localhost:8080/cineaura-backend/uploads/user_1_1781862165.png', '$2y$10$x106dSzzrcc7GGdcEpYM2.Z4xnSifRldnx/MXh1H73dcQlIAF/73K', '', 'ADMIN', '2026-06-02 15:56:37'),
(2, 'Nguyen Van A', 'thekiettran74@gmail.com', NULL, '$2y$10$uLyJ/jl9Mpoo2m4uZwhKgOt4MXIq3ulbohVQCDOU2FfNAiGF8kH16', NULL, 'USER', '2026-06-09 12:06:26');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `showtime_id` (`showtime_id`);

--
-- Chỉ mục cho bảng `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`code`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `theater_id` (`theater_id`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `seat_types`
--
ALTER TABLE `seat_types`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `theaters`
--
ALTER TABLE `theaters`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `theaters`
--
ALTER TABLE `theaters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`);

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
