@echo off
REM ============================================================================
REM Entre Nous - Automated Database Import Script for Windows
REM ============================================================================
REM This script creates the database and imports the schema and seed data
REM Requires PostgreSQL to be installed and running
REM ============================================================================

setlocal enabledelayedexpansion

REM Configuration (EDIT THESE)
set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
set POSTGRES_USER=postgres
set POSTGRES_HOST=localhost
set POSTGRES_PORT=5432
set DB_NAME=entre_nous
set DB_PASSWORD=aziz5580

echo.
echo ============================================================================
echo  Entre Nous - Database Import Script
echo ============================================================================
echo.

REM Check if psql exists
if not exist "%PSQL_PATH%" (
    echo ERROR: PostgreSQL psql not found at:
    echo %PSQL_PATH%
    echo.
    echo Please edit this file and update PSQL_PATH to your PostgreSQL installation.
    echo Typical locations:
    echo   - C:\Program Files\PostgreSQL\14\bin\psql.exe
    echo   - C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe
    echo.
    pause
    exit /b 1
)

echo [1/3] Creating database '%DB_NAME%'...
"%PSQL_PATH%" -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -tc "SELECT 1 FROM pg_database WHERE datname = '%DB_NAME%'" | findstr /c:"1" >nul
if %errorlevel% == 0 (
    echo     Database '%DB_NAME%' already exists. Skipping creation.
) else (
    "%PSQL_PATH%" -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -c "CREATE DATABASE %DB_NAME%;"
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create database
        echo Make sure PostgreSQL is running and you have the correct password.
        pause
        exit /b 1
    )
    echo     Database '%DB_NAME%' created successfully.
)

echo.
echo [2/3] Importing schema from 'entre_nous.sql'...
set PGPASSWORD=%DB_PASSWORD%
"%PSQL_PATH%" -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -d %DB_NAME% -f "entre_nous.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to import schema
    pause
    exit /b 1
)
echo     Schema imported successfully.

echo.
echo [3/3] Importing seed data from 'seed.sql'...
"%PSQL_PATH%" -U %POSTGRES_USER% -h %POSTGRES_HOST% -p %POSTGRES_PORT% -d %DB_NAME% -f "seed.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to import seed data
    pause
    exit /b 1
)
echo     Seed data imported successfully.

echo.
echo ============================================================================
echo ✓ Database setup complete!
echo ============================================================================
echo.
echo Next steps:
echo  1. Update your backend\.env file with:
echo     DATABASE_URL=postgresql://%POSTGRES_USER%:YOUR_PASSWORD@%POSTGRES_HOST%:%POSTGRES_PORT%/%DB_NAME%
echo  2. Start backend server:
echo     cd ..\
echo     npm run dev
echo  3. Start frontend server:
echo     cd ..\..\frontend
echo     npm run dev
echo.
echo Visit:
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:3000/health
echo.
pause
