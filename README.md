## Getting Started

#### 1. Fork the repo

  Sign in to your GitHub account and fork the following repo:

  ```
  https://github.com/rroyson/art-api-exam
  ```

#### 2. Clone your fork

  Clone your fork to your local machine and install the project's dependencies.

  ```
  $ git clone <url>
  $ cd instruments-api-mock-exam
  $ yarn
  ```

#### 3. Establishing your environment

  Look at the **.env-sample** file for a guide.

  The Api is set up to run on two separte database platforms.  One being **SQL** and the other pouchdb.  To set up the api on the pouchdb server use the following from the **.env-sample** file.  

  | Value          | Description           
  | -------------  |:-------------:
  | COUCHDB_URL    | This link is composed of your api `key`, `password`, and `base-url`.  
  | COUCHDB_NAME   | This will be the name of your api  
  | PORT           | This describes the port in which your api will run. The api will start on port 4000 by default.

  If you would like a more traditional experience you can use the **SQL** database. Run the `art.sql` file in your **Workbench** to create your database and tables(see[ Load Data]()).  Next set up your environment using the following from the **.env-sample** file.    

  | Value          | Description           
  | -------------  |:-------------:
  | DAL            | This sets the Default Dal to `dal-sql.js`.  To switch to the pouch database, in `package.json`, modify the start script to be `dal.js`
  | PORT           | This describes the port in which your api will run. The api will start on port 4000 by default.
  | MYSQL_HOST     | If using 'Docker' value will be `0.0.0.0` otherwise use `127.0.0.1`.
  | MYSQL_PORT     | **Port** shoudld be set to `3306`
  | MYSQL_USER     | This value contains your personal **SQL Username**
  | MYSQL_PASSWORD | This value contains your personal **SQL Password**
  | MYSQL_DATABASE | This value will be `art`




  Once correctly set up `yarn start` will start your api.

#### 4. Load data

  PouchDB
  - To load current data via `bulkDocs` located in **load-data.js**:

    - Navigate to terminal and type: `yarn load`.  
  - To add and customize your own data:
   - navigate to **load-data.js**
   - Input desired data into the `bulkDocs` function.  

  - After loading:
   - `yarn load` to update your database with the new documents

SQL
- Use the `art.sql` file to load data by loading into **Workbench**.

#### 5. Load indexes

  - To load indexes:
    - Navigate to your command line and type: `yarn loadIndex`. This will load all indexes for the project.

#### 6. Start the API

  Run `yarn start` in your terminal to start the api on the **SQL** server.  The api will start on port 4000 by default.

  Run `yarn start-couch` in your terminal to start the api on the **pouchdb** server.  The api wil star on port 4000 by default.


  *Note- you can view all run scripts in *package.json**

## EndPoints

#### Post - art/paintings
Use `POST` to create a new painting and add it to the database. The required fields are `name`, `movement`,  `artist`, `yearCreated`, and `museum`.
Your url for a `POST` will look something like this:

`localhost:4000/art/paintings`

 Here is an **example** of a valid input:

```
{

  name: 'The Starry Night',
  type: 'painting',
  movement: 'post-impressionism',
  artist: 'Vincent van Gogh',
  yearCreated: 1889,
  museum: { name: 'Museum of Modern Art', location: 'New York' }
}
```
#### Get - art/paintings/:id

Use `GET` to view a single painting from the database. Be sure to include the `_id` of the item you wish to view. Your url for a `GET` will look something like this:

`localhost:4000/art/paintings/painting_starry_night`

The last bit is the `_id` of the painting you would like to view.

This link would return:

```
{
    "_id": "painting_starry_night",
    "_rev": "1-141a0f40ed6168ab9c92f1d1e705e61b",
    "name": "The Starry Night",
    "type": "painting",
    "movement": "post-impressionism",
    "artist": "Vincent van Gogh",
    "yearCreated": 1889,
    "museum": {
        "name": "Museum of Modern Art",
        "location": "New York"
    }
}
```

#### Put - art/paintings/:id

Use `PUT` to update a painting in the database. Much like the `GET` for a single item, you will need to include an `_id` value for the item you would like to modify.

**Example:** `localhost:4000/art/paintings/painting_starry_night`

In order to update an item you must include the fields `_id`, `_rev`, `name`, `movement`, `artist`, `yearCreated`, and `museum`. Be sure you have the most up to date `_rev` in order to successfully update.

Lets look at an example body for updating our previous painting!

```
{
    "_id": "painting_starry_night",
    "_rev": "1-141a0f40ed6168ab9c92f1d1e705e61b",
    "name": "The Starry Night",
    "type": "painting",
    "movement": "post-impressionism",
    "artist": "Vincent van Gogh",
    "yearCreated": 1889,
    "museum": {
        "name": "Smithsonian",
        "location": "Washington"
    }
}
```
Here we have changed the `museum` name and location.



#### Delete - art/paintings/:id

Use the `DELETE` to, obviously, delete a painting from the database.  All you need is the `_id` from the painting you wish to delete and run it!  

**Example:** `localhost:4000/art/paintings/painting_starry_night`


#### GET - art/paintings/

Using this `GET` call you can grab the entire list of paintings.
**Example:** `localhost:4000/art/paintings`

There are also some helpful features for narrowing down your results.

**Limiting and Pagination**

You can use `query` strings to `limit` your results to a certain number per page.  

**Example:** `localhost:4000/art/paintings?limit=10`

This will return only 10 of the results at a time. The API is defaulted to a `limit` of 5 but feel free to set your own!

To see the next page of results simply use the `lastItem` query and the `_id` of the last item on the current page to bring up the next page of results.

 **Examples:**
  - Using default limit:

      `localhost:4000/art/paintings?lastItem=painting_starry_night`




  - Using custom limit:

     `localhost:4000/art/paintings?limit=10&lastItem=painting_starry_night`

**Filter**

There is also a `filter` query string that can be used to sort results by a certain field. You cannot use `lastItem` while using `filter`. Heres a few examples of how to do so:

**Examples:**
- Using default limit:

    `localhost:4000/art/paintings?filter=movement:post-impressionism`




- Using custom limit:

   `localhost:4000/art/paintings?limit=10&filter=movement:post-impressionism`



The format of the `filter` query is `filter=field:value`

**Example:** `filter=movement:post-impressionism`

You can filter by `name`, `movement`, `artist` and `yearCreated` fields.  

A Request that looks like this:

`localhost:4000/art/paintings?filter=artist:Pierre-Auguste Renoires`


**Returns:**

```
[
    {
        "_id": "painting___bal_pu_whips_de_la_wrets",
        "_rev": "1-2a2ce108a658b66dbbedab595dbcaba4",
        "name": "The Bal pu whips de la wrets",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Pierre-Auguste Renoires",
        "yearCreated": 1876,
        "museum": {
            "name": "Musée d’Orsay",
            "location": "Paris"
        }
    },
    {
        "_id": "painting__bal_pu_whips_de_la_plates",
        "_rev": "1-a8a58fb797abf04d83501d87f8ff2f18",
        "name": "The Bal pu whips de la Plates",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Pierre-Auguste Renoires",
        "yearCreated": 1876,
        "museum": {
            "name": "Musée d’Orsay",
            "location": "Paris"
        }
    },
    {
        "_id": "painting__bal_pu_whips_de_la_pompei",
        "_rev": "1-584e0de92c0bcc9dd691a7128835c78f",
        "name": "The Bal pu whips de la Pompei",
        "type": "painting",
        "movement": "impressionism",
        "artist": "Pierre-Auguste Renoires",
        "yearCreated": 1876,
        "museum": {
            "name": "Musée d’Orsay",
            "location": "Paris"
        }
    }
  ]
  ```
  #### Happy Coding
