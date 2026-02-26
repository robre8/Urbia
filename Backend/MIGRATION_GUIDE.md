# Documentación sobre la Migración de Java a Python

## 📋 Resumen de Cambios

El proyecto ha sido migrado exitosamente de **Spring Boot (Java)** a **FastAPI (Python)**. Esta documento describe los cambios principales y cómo se han mapeado los componentes.

## 🔄 Mapeo de Componentes

### Java Spring Boot → Python FastAPI

| Componente Java | Componente Python | Descripción |
|-----------------|-------------------|-------------|
| Spring Boot | FastAPI | Framework web principal |
| Spring Data JPA | SQLAlchemy | ORM para base de datos |
| Spring Security | python-jose + passlib | Autenticación y seguridad |
| @RestController | APIRouter | Controladores de rutas |
| Entity | SQLAlchemy Model | Modelos de base de datos |
| @Service | Funciones en routes/ | Lógica de negocio |
| @Autowired | Depends() | Inyección de dependencias |
| application.properties | settings.py | Configuración |
| pom.xml | requirements.txt | Dependencias |
| mvnw | python -m uvicorn | Ejecución |

## 📦 Estructura de Directorios

```
Backend/
├── main.py                      # Punto de entrada (equivalente a @SpringBootApplication)
├── requirements.txt             # Dependencias (equivalente a pom.xml)
├── Dockerfile                   # Contenedor Docker
├── .env.example                 # Variables de entorno
├── init_db.py                   # Inicialización de BD (equivalente a scripts SQL)
├── conftest.py                  # Configuración de pytest
│
├── app/
│   ├── __init__.py
│   │
│   ├── config/                  # Configuración (equivalente a @Configuration)
│   │   ├── settings.py          # application.properties
│   │   ├── database.py          # Configuración de BD
│   │   └── security.py          # JWT y autenticación
│   │
│   ├── models/                  # Entity models (@Entity)
│   │   └── models.py            # User, Report, Category
│   │
│   ├── schemas/                 # DTOs (@RequestBody/@ResponseBody)
│   │   └── schemas.py           # UserCreate, ReportResponse, etc.
│   │
│   ├── routes/                  # @RestController endpoints
│   │   ├── auth.py              # /api/auth
│   │   ├── reports.py           # /api/reports
│   │   └── categories.py        # /api/categories
│   │
│   └── services/                # @Service business logic
│       ├── s3_service.py        # AWS S3 operations
│       └── gemini_service.py    # Google Gemini API
│
└── tests/                       # Pruebas unit (equivalente a @SpringBootTest)
    ├── test_auth.py
    ├── test_reports.py
    ├── test_categories.py
    └── test_health.py
```

## 🔐 Cambios en Seguridad

### Autenticación JWT

**Java Spring Boot:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configuración compleja de seguridad
}
```

**Python FastAPI:**
```python
# app/config/security.py
def create_access_token(data: dict) -> str:
    # Crear JWT
    
def verify_token(credentials: HTTPAuthCredentials = Depends(security)) -> dict:
    # Verificar JWT
```

### Hashing de Contraseñas

**Java:** BCrypt vía Spring Security  
**Python:** BCrypt vía passlib

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])

# Hash
hashed = pwd_context.hash(password)

# Verify
is_valid = pwd_context.verify(password, hashed)
```

## 🗄️ Base de Datos

### ORM Cambios

**Java (JPA):**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(unique = true)
    private String email;
}
```

**Python (SQLAlchemy):**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
```

### Migraciones

**Java:** Hibernate DDL auto (spring.jpa.hibernate.ddl-auto=update)  
**Python:** SQLAlchemy auto-create en main.py + Alembic para migraciones avanzadas

```python
# En main.py
Base.metadata.create_all(bind=engine)
```

## 🔌 API Endpoints

El mapeo de endpoints permanece igual, solo cambia la implementación interna:

```
POST /api/auth/register          # Registrar usuario
POST /api/auth/login             # Login
GET  /api/auth/me                # Usuario actual

GET  /api/reports                # Listar reportes
POST /api/reports                # Crear reporte
GET  /api/reports/{id}           # Obtener reporte
PUT  /api/reports/{id}           # Actualizar reporte
DELETE /api/reports/{id}         # Eliminar reporte

GET  /api/categories             # Listar categorías
POST /api/categories             # Crear categoría
```

## 📚 Inyección de Dependencias

**Java Spring Boot:**
```java
@Service
public class ReportService {
    @Autowired
    private ReportRepository repo;
}
```

**Python FastAPI:**
```python
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return reports
```

## 🧪 Testing

**Java:** JUnit 5 + MockMvc  
**Python:** pytest

```python
# tests/test_auth.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/api/auth/register", json={...})
    assert response.status_code == 200
```

## 🚀 Ventajas de Python/FastAPI

✅ **Más rápido de desarrollar** - Menos boilerplate  
✅ **Mejor documentación automática** - Swagger/OpenAPI  
✅ **Mejor rendimiento** - Async/await nativo  
✅ **Comunidad más amigable** - Stack más moderno  
✅ **Dependencias más ligeras** - Startup más rápido  
✅ **Mayor flexibilidad** - Dinámico y fácil de cambiar  

## 🔧 Configuración de Desarrollo

Ver [Backend/README.md](./Backend/README.md) para instrucciones completas de instalación y desarrollo.

## 📝 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [python-jose Documentation](https://python-jose.readthedocs.io/)
- [pytest Documentation](https://docs.pytest.org/)
