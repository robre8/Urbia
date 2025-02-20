import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class GoogleCSUpload {
    public static void main(String[] args) throws IOException {

        String bucketName = "nombre-del-bucket";
        String objectName = "archivo-subido.jpg";
        String filePath = "ruta/local/archivo.jpg";

        // Inicializa el cliente de Storage
        Storage storage = StorageOptions.getDefaultInstance().getService();

        // Sube el archivo
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, Files.readAllBytes(Paths.get(filePath)));

        System.out.println("Archivo subido a: gs://" + bucketName + "/" + objectName);
    }
}