package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.DTO.Response.NameIdEmployeeRes;
import com.dental_clinic.auth_service.DTO.Response.UserDetailRes;
import com.dental_clinic.auth_service.DTO.Response.UserRes;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;

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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy tài khoản có id = '" + id + "'"));
    }

    public List<NameIdEmployeeRes> getNameAndIdAbleOfEmployeeByRoleId(Long roleId){
        List<NameIdEmployeeRes> result = userRepository.findByRoleId(roleId).stream()
                .filter(user -> !user.is_ban())
                .map(user -> new NameIdEmployeeRes(user.getId(), user.getName()))
                .toList();

       return result;
    }

    public User getUserByEmail(String email) {
        return (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tồn tại email này!"));
    }

    public AccountUpdateRes updateAccountInfo(UpdateAccount req) {
        User u = getById(req.userId());

        req.email().ifPresent(email -> {
            FieldUtils.checkStrEmpty(email, "Email");
            if(userRepository.existsByEmailAndIdNot(email, req.userId()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại email này");
            if(!FieldUtils.isValidEmail(email)) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Email không hợp lệ");
            }
            u.setEmail(email);
        });
        req.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Họ tên");
            u.setName(name);
        });

        req.gender().ifPresent(u::setGender);

        req.phone().ifPresent(phone -> {
            FieldUtils.checkStrEmpty(phone, "Số điện thoại");
            if(userRepository.existsByPhoneAndIdNot(phone, req.userId()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại số điện thoại này");
            u.setPhone(phone);
        });
        req.address().ifPresent(address -> {
            FieldUtils.checkStrEmpty(address, "Địa chỉ");
            u.setAddress(address);
        });

        req.salary().ifPresent(salary -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(salary);
            if(salary < 100000)
                throw new AppException(ErrorCode.INVALID_REQUEST, "Lương không được nhỏ hơn 100.000 đồng");
            u.setSalary(salary);
        });

        req.birthday().ifPresent(birthday -> {
            if (birthday.isAfter(LocalDate.now())) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Ngày sinh không hợp lệ");
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

    public UserDetailRes getUserDetailById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy tài khoản có id = '" + id + "'"));
        return new UserDetailRes(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAddress(),
                user.getPhone(),
                user.getBirthday(),
                user.getSalary(),
                user.getCreated_at(),
                user.isGender(),
                user.is_ban(),
                user.getImg()
        );
    }

    public void changeImg(ChangeAuthServiceImageRequest request) {
        // Kiểm tra vật liệu tồn tại không
        User user = userRepository.findById(
                request.userId()).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Tài khoản không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.image();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(VariableUtils.TYPE_UPLOAD_AUTH_SERVICE);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_ERROR, "Lỗi khi tạo thư mục upload: " + e.getMessage());
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
            throw new AppException(ErrorCode.FILE_ERROR, "Lỗi khi lưu tập tin: " + e.getMessage());
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

    public NameIdEmployeeRes getNameAndIdOfUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy tài khoản có id = '" + id + "'"));
        return new NameIdEmployeeRes(user.getId(), user.getName());
    }

    public List<UserRes> getListUserByRoleId(Long roleId) {
        List<User> users = userRepository.findByRoleId(roleId).stream()
                .sorted((u1, u2) -> u2.getCreated_at().compareTo(u1.getCreated_at())) // Sort by created_at descending
                .toList();

        List<UserRes> result = new ArrayList<>();
        for (User user : users) {
            UserRes userRes = new UserRes(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getBirthday(),
                    user.getSalary(),
                    user.getCreated_at(),
                    user.isGender(),
                    user.is_ban()
            );
            result.add(userRes);
        }
        return result;
    }
}
