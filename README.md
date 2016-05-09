# executable-webapp
Simple node express app generating executable app from html file.
Uses [nw-builder](https://github.com/nwjs/nw-builder) project for building executable files.

## Requirements
Install Nodejs in version >= 4.4.0
```
sudo apt-get install nodejs
```

Clone repository and install packages:
```
npm install
```

## Running
To set server port.
```
export PORT=8080
```

To run app
```
node index.js
```

## Usage
App accepts ```APP_URL/``` POST requests with file form data and ```format``` param.

Avaliable formats:
* ```win32```
* ```win64```
* ```osx32```
* ```osx64```
* ```linux32```
* ```linux64```

Example: ```APP_URL/?format=win32```

Returns zipped folder with executable app in specified format.
