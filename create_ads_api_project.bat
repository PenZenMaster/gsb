@echo off
SET ROOT_DIR=ads-api

echo Creating Google Ads API test mode project folder...

mkdir %ROOT_DIR%
mkdir %ROOT_DIR%\auth
mkdir %ROOT_DIR%\config
mkdir %ROOT_DIR%\src
mkdir %ROOT_DIR%\token

:: Create a blank README.md just to hold the root
type nul > %ROOT_DIR%\README.md

echo.
echo Project directories created successfully:
echo - %ROOT_DIR%\auth
echo - %ROOT_DIR%\config
echo - %ROOT_DIR%\src
echo - %ROOT_DIR%\token
echo - %ROOT_DIR%\README.md
echo.
echo Skippy's got this. You're cleared for dev work, G!
pause
