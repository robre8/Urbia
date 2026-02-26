#!/bin/bash
# Script de utilidad para desarrollo del Backend

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones
install() {
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    pip install -r requirements.txt
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
}

dev() {
    echo -e "${YELLOW}Iniciando servidor de desarrollo...${NC}"
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
}

test() {
    echo -e "${YELLOW}Ejecutando tests...${NC}"
    pytest
}

format() {
    echo -e "${YELLOW}Formateando código...${NC}"
    black .
    isort .
    echo -e "${GREEN}✅ Código formateado${NC}"
}

lint() {
    echo -e "${YELLOW}Ejecutando linter...${NC}"
    flake8 .
    pylint app/
}

init_db() {
    echo -e "${YELLOW}Inicializando base de datos...${NC}"
    python init_db.py
    echo -e "${GREEN}✅ Base de datos inicializada${NC}"
}

migrate() {
    echo -e "${YELLOW}Ejecutando migraciones...${NC}"
    alembic upgrade head
    echo -e "${GREEN}✅ Migraciones completadas${NC}"
}

help() {
    echo "Comandos disponibles:"
    echo "  install    - Instalar dependencias"
    echo "  dev        - Iniciar servidor de desarrollo"
    echo "  test       - Ejecutar tests"
    echo "  format     - Formatear código"
    echo "  lint       - Ejecutar linters"
    echo "  init_db    - Inicializar base de datos"
    echo "  migrate    - Ejecutar migraciones"
}

# Main
case "$1" in
    install)
        install
        ;;
    dev)
        dev
        ;;
    test)
        test
        ;;
    format)
        format
        ;;
    lint)
        lint
        ;;
    init_db)
        init_db
        ;;
    migrate)
        migrate
        ;;
    *)
        help
        ;;
esac
