# Prikka price in docker image


## Develop
Install packages
```
npm install
```
Start developing
```
npm run dev
```

</br>

## Docker
Build
```
docker build -t pirkka-price -f ./Dockerfile .
````
Run
```
docker run -it pirkka-price
```

### Output
Success
```sh
< docker run -it pirkka-price                    
> PIRKKA PRICE: 1,15
```
Failure
```
< docker run -it pirkka-price
> Error: net::ERR_NAME_NOT_RESOLVED at https://www.k-ruoka.fi/haku?q=pirkka%20olut&tuote=pirkka-iii-olut-033l-45-tlk-si-6410405091260
    at navigate (/home/node/node_modules/puppeteer-core/lib/cjs/puppeteer/common/Frame.js:235:23)
    ...
> PIRKKA PRICE FAILED
```
