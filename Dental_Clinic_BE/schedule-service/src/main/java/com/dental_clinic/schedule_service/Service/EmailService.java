package com.dental_clinic.schedule_service.Service;

import com.dental_clinic.schedule_service.DTO.Request.EmailAppointmentPatientReq;
import com.dental_clinic.schedule_service.Entity.AppointmentStatus;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendAppointmentConfirmForPatient(EmailAppointmentPatientReq req) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlContent = String.format(
                """
                <p>Xin chào %s [%s]</p>
                <p>Chúng tôi xin thông báo với bạn rằng lịch khám của bạn đã được xác nhận.</p>
                <p>Sau đây là thông tin chi tiết về lịch khám của bạn:</p>
                <table style="border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; min-width: 400px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);">
                    <thead>
                        <tr style="background-color: #009879; color: #ffffff;">
                            <th style="padding: 12px 15px;">Mã lịch khám</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Thời gian bắt đầu</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Thời gian kết thúc</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Triệu chứng</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Ghi chú</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #009879;">
                            <th style="padding: 12px 15px;">Trạng thái</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                    </tbody>
                </table>
                """,
                req.patientName(), req.patientId(), req.appointmentId(),
                formatDateTime(req.timeStart()), formatDateTime(req.timeEnd()), req.symptoms(), req.note(),
                AppointmentStatus.translateStatus(String.valueOf(req.status()))
        );

        helper.setTo(req.email());
        helper.setSubject("Thông tin lịch khám " + req.appointmentId());
        helper.setText(htmlContent, true); // `true` để bật chế độ HTML

        // Sending the mail
        javaMailSender.send(mimeMessage);
    }

    @Async
    public void sendAppointmentWithNewStatusForPatient(EmailAppointmentPatientReq req) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String rowColor = AppointmentStatus.valueOf(String.valueOf(req.status())) == AppointmentStatus.finished ? "#28a745" : "#ff4d4d";
        String htmlContent = String.format(
                """
                <p>Xin chào %s [%s]</p>
                <p>Chúng tôi xin thông báo rằng lịch khám của bạn đã chuyển sang trạng thái <b>%s</b>.</p>
                <p>Sau đây là thông tin chi tiết về lịch khám của bạn:</p>
                <table style="border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; min-width: 400px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);">
                    <thead>
                        <tr style="background-color: %s; color: #ffffff;">
                            <th style="padding: 12px 15px;">Mã lịch khám</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Thời gian bắt đầu</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Thời gian kết thúc</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Triệu chứng</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #dddddd;">
                            <th style="padding: 12px 15px;">Ghi chú</th>
                            <td style="padding: 12px 15px;">%s</td>
                        </tr>
                    </tbody>
                </table>
                """,
                req.patientName(), req.patientId(), AppointmentStatus.translateStatus(String.valueOf(req.status())), rowColor,
                req.appointmentId(),
                formatDateTime(req.timeStart()), formatDateTime(req.timeEnd()), req.symptoms(), req.note()
        );

        helper.setTo(req.email());
        helper.setSubject("Thông báo lịch khám " + req.appointmentId() + " đã đổi sang trạng thái " + AppointmentStatus.translateStatus(String.valueOf(req.status())));
        helper.setText(htmlContent, true); // `true` để bật chế độ HTML

        // Sending the mail
        javaMailSender.send(mimeMessage);
    }

    private String formatDateTime(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return dateTime.format(formatter);
    }


}
