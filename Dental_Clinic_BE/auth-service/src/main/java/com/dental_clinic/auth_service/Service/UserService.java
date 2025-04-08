package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.DTO.Request.ChangeAuthServiceImageRequest;
import com.dental_clinic.auth_service.DTO.Request.UpdateAccount;
import com.dental_clinic.auth_service.DTO.Response.AccountUpdateRes;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Repository.UserRepository;
import com.dental_clinic.auth_service.Utils.FieldUtils;
import com.dental_clinic.auth_service.Utils.ImageUtils;
import com.dental_clinic.auth_service.Utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy tài khoản có id = '" + id + "'"));
    }

    public User getUserByEmail(String email) {
        for (User user: getUsers()) {
            if(user.getEmail().equals(email)) return user;
        }
        throw  new RuntimeException("Không tồn tại email này!");
    }

    public AccountUpdateRes updateAccountInfo(UpdateAccount req) {
        User u = getById(req.userId());

        req.email().ifPresent(email -> {
            FieldUtils.checkStrEmpty(email, "Đối tượng sử dụng");
            if(userRepository.existsByEmailAndIdNot(email, req.userId()))
                throw new RuntimeException("Đã tồn tại email này");
            if(!FieldUtils.isValidEmail(email)) {
                throw new RuntimeException("Email không hợp lệ");
            }
            u.setEmail(email);
        });
        req.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Họ tên");
            if(userRepository.existsByNameAndIdNot(name, req.userId()))
                throw new RuntimeException("Đã tồn tại tên này");
            u.setName(name);
        });
        req.phone().ifPresent(phone -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(phone);
            if(userRepository.existsByPhoneAndIdNot(phone, req.userId()))
                throw new RuntimeException("Đã tồn tại số điện thoại này");
            u.setPhone(phone);
        });
        req.address().ifPresent(address -> {
            FieldUtils.checkStrEmpty(address, "Địa chỉ");
            u.setAddress(address);
        });

        req.salary().ifPresent(salary -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(salary);
            u.setSalary(salary);
        });

        req.birthday().ifPresent(birthday -> {
            if (birthday.isAfter(LocalDate.now())) {
                throw new RuntimeException("Ngày sinh không hợp lệ");
            }
            u.setBirthday(birthday);
        });


        User resultUser = userRepository.save(u);

        return new AccountUpdateRes(
                resultUser.getId(),
                resultUser.getEmail(),
                resultUser.getName(),
                resultUser.getAddress(),
                resultUser.getBirthday(),
                resultUser.getPhone(),
                resultUser.getSalary()
        );
    }

    public void changeImg(ChangeAuthServiceImageRequest request) {
        // Kiểm tra vật liệu tồn tại không
        User user = userRepository.findById(
                request.userId()).orElseThrow(
                () ->  new RuntimeException("Tài khoản không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.image();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(VariableUtils.TYPE_UPLOAD_AUTH_SERVICE);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo thư mục upload: " + e.getMessage());
        }
        // Thực hiện thay đổi material service img
        try {
            // Lưu file vào server
            String fileName = ImageUtils.saveFileServer(file, VariableUtils.TYPE_UPLOAD_AUTH_SERVICE);
            // Xóa file cũ
            if (!user.getImg().equals(VariableUtils.DEFAULT_USER)) {
                ImageUtils.deleteFileServer(user.getImg());
            }
            // Cập nhật đường dẫn file mới vào database
            user.setImg(fileName);
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu tập tin: " + e.getMessage());
        }
    }

    //    Scan và xóa hình ảnh không còn tham chiếu trong database
    public void SYSTEM_scanAndDeleteUnusedImgs() {
        new Thread(() -> {
            List<String> listImgs = userRepository.findAllImg().stream()
                    .filter(img -> !(img.equals(VariableUtils.DEFAULT_USER))).toList();
            Path uploadDir = Path.of(VariableUtils.UPLOAD_DIR_AUTH_SERVICE);
            try {
                // Lấy danh sách tất cả các tệp trong thư mục uploads/material_services
                List<Path> allFiles = Files.walk(uploadDir)
                        .filter(Files::isRegularFile) // Chỉ lấy các tệp, không lấy thư mục
                        .toList();

                // Xóa tệp trên server nếu không nằm trong listImgs
                for (Path file : allFiles) {
                    String fileName = file.getFileName().toString();
                    // Kiểm tra xem tệp có nằm trong listImgs không
                    if (!listImgs.contains(VariableUtils.UPLOAD_DIR_AUTH_SERVICE_POSTFIX + fileName)) {
                        Files.delete(file);
                        System.out.println(VariableUtils.getServerScanPrefix() + "Delete unused material img " + file);
                    }
                }

                // Đổi tệp trên database nếu không nằm trong server
                for (String img : listImgs) {
                    Path imgPath = Path.of(uploadDir.toString(), img.split("/")[1]);
                    if (!Files.exists(imgPath)) {
                        Optional<User> user = userRepository.findByImg(img);
                        if (user.isPresent()){
                            user.get().setImg(VariableUtils.DEFAULT_USER);
                            userRepository.save(user.get());
                            System.out.println(VariableUtils.getServerScanPrefix()
                                    + "Change img of user " + user.get().getId() + " to default on database");
                        }
                    }
                }
                System.out.println(">>>\n" + VariableUtils.getServerStatPrefix()
                        + "Scan and delete unused user img completed\n<<<");

            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
    }

}
