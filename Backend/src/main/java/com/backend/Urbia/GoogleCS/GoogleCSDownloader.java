import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.nio.file.Paths;

public class GoogleCSDownloader {
    public static void main(String[] args) {
        // Configura el nombre del bucket y el archivo
        String bucketName = "nombre-del-bucket";
        String objectName = "archivo-subido.jpg";
        String destFilePath = "ruta/local/archivo-descargado.jpg";

        // Inicializa el cliente de Storage
        Storage storage = StorageOptions.getDefaultInstance().getService();

        // Descarga el archivo
        Blob blob = storage.get(bucketName, objectName);
        blob.downloadTo(Paths.get(destFilePath));

        System.out.println("Archivo descargado a: " + destFilePath);
    }
}