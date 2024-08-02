
### How to Run Locally

1. Clone the repo
   ```sh
   git clone https://github.com/alicas22/koach.git  
   ```
   
2. Naviagate to the  directory
   ```sh
   cd koach
   ```

3. Install NPM packages
   ```sh
   npm install
   ```
4. Install Postgress

5. Create Postgres Database  
  ```sh
   psql -U postgres
  CREATE DATABASE database_development;
  CREATE DATABASE database_test;
  ```
6. Create a .env in root:
   ```sh
   PORT=8000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=604800
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=database_development
   DB_HOST=127.0.0.1
   ```
7. Migrate and Seed the database
   ```sh
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
8. Start the server
   ```sh
   npm start
   ```
9. Run the tests
   ```sh
   npm test
   ```  
10. Navigate to http://localhost:8000/api-docs/ to see the swagger documentation.
