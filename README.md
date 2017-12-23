<p align="center">
  <img src="https://user-images.githubusercontent.com/11808903/34305458-e24969ee-e746-11e7-9d9d-f6c589b30f3c.png" width="200"/>
</p>

<h1 align="center">GraphQL GUC</h1>

<p align="center">Get your German University in Cairo (GUC) student info with GraphQL!</p>

## Features

*  🔑  Login
*  📚  Courses
*  ✅  Attendance
*  💯  Grades
*  📝  Exams
*  🗓️  Schedule
*  📜  Transcript

## Usage

<pre><b>POST</b> https://graphql-guc.now.sh</pre>

<details>

<summary>Query</summary>

<br />

```graphql
query {
  student(username: "john.doe", password: "123456") {
    courses {
      code
      name
      absence {
        level
        severity
      }
      coursework {
        type
        grade
        maximumGrade
      }
      midterm {
        grade
      }
      exam {
        venue
        seat
        startsAt
      }
    }
    schedule {
      type
      weekday
      number
      venue
      course {
        code
        name
      }
    }
    transcript {
      cumulativeGPA
      semesters {
        year
        type
        gpa
        entries {
          course {
            code
            name
          }
          grade {
            german
            american
          }
          creditHours
        }
      }
    }
  }
}
```

Try out this query in the [live demo](https://graphql-guc.now.sh/playground).

</details>

## Development

```bash
$ yarn
$ yarn dev
$ open http://localhost:8080/playground
```

## Docker support
To run the app in a dockerized envoriment run the following commands.

```bash
$ docker-compose up -d
```

To log into the running conatiner 

```bash
$ docker-compose exec backend bash
``` 

The `Dockerfile` in this repo is customized to run in a production level which means the enviroment 
will handle the load balancing and self-healing if a cluster crashes. It uses [pm2](https://github.com/Unitech/pm2)
to automate the common system admin tasks and system monitoring.

## Thanks

* [Nabila Ahmed](https://github.com/Nabila63Ahmed), for her early adoption of the idea & help with coding a previous version of the project.

* [Ahmed Elhanafy](https://github.com/ahmedlhanafy), for his inspired propulsion towards learning GraphQL.

* [Abdullah Maged](https://www.behance.net/beedoz37718e3), for designing the logo.

## License

MIT License
