@echo off
REM Script de utilidad para desarrollo del Backend (Windows)

IF "%1%"=="install" (
    echo Instalando dependencias...
    pip install -r requirements.txt
    echo ✅ Dependencias instaladas
) ELSE IF "%1%"=="dev" (
    echo Iniciando servidor de desarrollo...
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
) ELSE IF "%1%"=="test" (
    echo Ejecutando tests...
    pytest
) ELSE IF "%1%"=="format" (
    echo Formateando código...
    black .
    isort .
    echo ✅ Código formateado
) ELSE IF "%1%"=="init_db" (
    echo Inicializando base de datos...
    python init_db.py
    echo ✅ Base de datos inicializada
) ELSE (
    echo Comandos disponibles:
    echo   install    - Instalar dependencias
    echo   dev        - Iniciar servidor de desarrollo
    echo   test       - Ejecutar tests
    echo   format     - Formatear código
    echo   init_db    - Inicializar base de datos
)
