[![Build Status](https://travis-ci.org/PoorlyDefinedBehaviour/trying-out-apollo.svg?branch=master)](https://travis-ci.org/PoorlyDefinedBehaviour/trying-out-apollo)

# Awesome Project Build with TypeORM

Steps to run this project:

```sh
$ sudo docker run -p 6379:6379 -d redis
$ cd backend 
$ yarn
$ yarn dev

$ cd ../worker
$ yarn
$ yarn start
```

# Testing
```sh
$ sudo docker run -p 6379:6379 -d redis
$ cd backend
$ yarn
$ yarn test
```