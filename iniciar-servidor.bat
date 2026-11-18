@echo off
chcp 65001 >nul
title Matemática Interactiva - Lanzador
echo ==============================================================
echo   Iniciando MATEMÁTICA INTERACTIVA en http://localhost:8080/
echo ==============================================================
start "" "http://localhost:8080/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1" -Port 8080
pause
