# boatbutler-backend

- See enpoints and request / response body examples in *boatbutler.postman_collection.json*
- Due to time contraints, not all routes have been finished / cleaned up
- For mock data, see:  *POST '/api/createMock'* - it automatically generates mock data, no requestBody is required.
- see package.json for scripts



Authentication was made using *JWT* and *passport* was used as a middleware for unpacking the token, for the protected routes.
    Only users of type COMPANY can call the protected endpoints

MongoDB was used as a database. There are embedded documents such as *job_media* (see schema in *Job.ts*), as well as references to other documents
Mongoose was used as an ORM


- For running locally:
    *  *.env* file should include an environment variable called *MONGO_URL*, which points at the local MongoDB database. *PORT* variable is optional as it will default to 3001, as seen in app.ts

- Hosted:  SPA is delopyed at https://awesome-blackwell-037aa5.netlify.app/
     
