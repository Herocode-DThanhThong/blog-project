package com.blogroot.blogroot.service;

import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.model.VerificationToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${email.from}")
    private String emailFrom;
    @Value("${app.front-end-url}")
    private String frontendUrl;

    private final JavaMailSender javaMailSender;

    public SimpleMailMessage makeMailMessage() {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(emailFrom);
        return simpleMailMessage;
    }

    public void sendVerificationEmail(VerificationToken verificationToken) {
        SimpleMailMessage simpleMailMessage = makeMailMessage();
        simpleMailMessage.setTo(verificationToken.getUser().getEmail());
        simpleMailMessage.setSubject("Verify your email to active your account");
        simpleMailMessage.setText("Please follow the link below to verify your email and activate your account\n"
                + frontendUrl + "/verify-account-result?token=" + verificationToken.getToken());
        javaMailSender.send(simpleMailMessage);
    }

    public void sendApproveRoleManagerRequestEmail(User user) {
        SimpleMailMessage simpleMailMessage = makeMailMessage();
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Congratulation! Your request change role to manager was approved");
        simpleMailMessage.setText("Now, you can create your own blog and share experiences for everyone. Please logout and sign in again.\nThanks!");
        javaMailSender.send(simpleMailMessage);
    }

    public void sendRejectRoleManagerRequestEmail(User user) {
        SimpleMailMessage simpleMailMessage = makeMailMessage();
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Sorry! Your request change role to manager was rejected");
        simpleMailMessage.setText("Please check your tile and description and re-send ours " +
                "more detail about the topics you want to share in our community");
        javaMailSender.send(simpleMailMessage);
    }
}
