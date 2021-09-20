cd _tests
docker run -it --rm --network host -v %cd%:/e2e -w /e2e cypress/included:3.2.0
cd ..
