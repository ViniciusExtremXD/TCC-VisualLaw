@echo off
echo ========================================
echo  Visual Law TCC - Fix + Rebuild
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Limpando cache antigo (.next, out)...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist .turbo rmdir /s /q .turbo
echo       OK

echo.
echo [2/5] Reinstalando dependencias (npm ci)...
call npm ci
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: npm ci falhou. Tentando npm install...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO FATAL: Nao foi possivel instalar dependencias.
        pause
        exit /b 1
    )
)
echo       OK

echo.
echo [3/5] Executando build (next build com output: export)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo  ERRO: Build falhou!
    echo  Verifique os erros acima.
    echo ========================================
    pause
    exit /b 1
)
echo       OK

echo.
echo [4/5] Verificando pasta out/...
if not exist out\index.html (
    echo ERRO: out\index.html nao encontrado!
    pause
    exit /b 1
)
if not exist out\reader\index.html (
    echo AVISO: out\reader\index.html nao encontrado
)
echo       out\index.html ............ OK
if exist out\reader\index.html echo       out\reader\index.html ..... OK
if exist out\_next\static echo       out\_next\static\ ......... OK

echo.
echo Listando term pages geradas:
if exist out\term (
    dir /b out\term
) else (
    echo AVISO: Nenhuma term page encontrada em out\term\
)

echo.
echo [5/5] Iniciando servidor local para teste...
echo       Acesse: http://localhost:3000
echo       Ctrl+C para parar
echo.
call npm run preview
