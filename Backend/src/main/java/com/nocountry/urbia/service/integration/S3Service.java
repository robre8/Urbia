package com.nocountry.urbia.service.integration;


import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final AmazonS3 s3Client;

    // Asegúrate de que este campo NO sea static
    @Value("${aws.s3.bucketName}")
    private String bucketName;

    public S3Service(@Value("${aws.s3.accessKey}") String accessKey,
                     @Value("${aws.s3.secretKey}") String secretKey,
                     @Value("${aws.s3.region}") String region) {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }

    public String uploadFile(MultipartFile file) {
        // Genera un nombre único para el archivo
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {

            s3Client.putObject(bucketName, fileName, file.getInputStream(), new ObjectMetadata());
        } catch (IOException e) {
            throw new RuntimeException("Error al subir el archivo a S3", e);
        }
        // Retorna la URL pública del objeto
        return s3Client.getUrl(bucketName, fileName).toString();
    }
}