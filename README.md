Our site allows users to browse a list of restaurants and view detailed summaries, including categories and average ratings based on user feedback. Users can sign up to join a community, share reviews, and rate restaurants.



# Instructions for setting up and running the project locally:

- create database

```
createdb acme_auth_store_db
```

- install dependencies

```
npm install && cd client && npm install
```

- start server in root directory of repository
```
npm run start:dev
```

- start vite server in client directory

```
npm run dev
```

# to test deployment
```
cd client && npm run build
```

browse to localhost:8080 

# to deploy
- build script for deploy

```
npm install && cd client && npm install && npm run build

```
- start script for deploy 

```
node server/index.js

```

- environment variables for deploy

```
DATABASE_URL for postgres database - "postgres://localhost/capstone_reviews"
```
