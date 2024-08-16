package com.saessakmaeul.bitamin.util.file.service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public S3Service(@Value("${cloud.aws.credentials.accessKey}") String accessKey,
                     @Value("${cloud.aws.credentials.secretKey}") String secretKey,
                     @Value("${cloud.aws.region.static}") String region) {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(fileName).build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
        return getFileUrl(fileName);
    }

    private String getFileUrl(String fileName) {
        URL url = s3Client.utilities().getUrl(builder -> builder.bucket(bucketName).key(fileName));
        return url.toString();
    }
}
