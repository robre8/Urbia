"""
Script para crear la base de datos PostgreSQL
"""
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Conectar a PostgreSQL (base de datos por defecto postgres)
conn_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

try:
    # Conectar a la base de datos postgres
    conn = psycopg2.connect(**conn_params)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    
    cursor = conn.cursor()
    
    # Verificar si la base de datos existe
    cursor.execute(
        "SELECT 1 FROM pg_database WHERE datname = 'urbia_db'"
    )
    exists = cursor.fetchone()
    
    if exists:
        print("✓ La base de datos 'urbia_db' ya existe")
    else:
        # Crear la base de datos
        cursor.execute(
            sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier('urbia_db')
            )
        )
        print("✓ Base de datos 'urbia_db' creada exitosamente")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Error: {e}")
    print("\nVerifica que PostgreSQL esté corriendo y las credenciales sean correctas")
