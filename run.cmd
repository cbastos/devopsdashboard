echo Installing api dependencies...
cd ./api
call npm install
echo Installing web dependencies...
cd ../web
call npm install
echo Installing _tests dependencies...
cd ../_tests
call npm install
cd ../
docker-compose -f ./docker-compose.yml  up