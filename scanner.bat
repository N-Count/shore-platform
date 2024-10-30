for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set branch=%%i
echo %branch%
sonar-scanner -Dsonar.branch.name=%branch%
