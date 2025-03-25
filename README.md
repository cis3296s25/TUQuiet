# TUQuiet

TUQuiet is a simple web app that helps Temple students find the best study spaces on campus through real-time peer reporting. Currently, students can quickly report and view noise levels and crowdedness of popular study locations. In the future, the system will recommend the most suitable spots based on the current conditions.

![image](https://github.com/user-attachments/assets/55d1c3d7-1205-4492-8575-e5082087debc)

# How to run

To run this repo, you will need working JDK, Apache Maven, and Node.js installations. Maven is bundled into IntelliJ IDEA, and may be included in other Java-specific IDE installations, or may be installed from the web. Once you have those installations, follow the instructions below to run a local version of TUQuiet.

FIRST

Clone this repository using the web url of this repository.
```
git clone [link]
```

THEN

Open the new TUQuiet folder in an IDE. This has only been tested in Visual Studio Code, but should work in other IDEs which can run Maven projects and ReactJS. 

Open a new terminal, and run this command:
```
cd backend
```

This will take you to the backend folder, which holds the Java code for TUQuiet.
To run this code, run these commands in your terminal:
```
mvn clean
mvn validate
mvn compile
mvn spring-boot:run
```

Open a second terminal. This should open in YourLocalPath\TUQuiet, but if it opens in backend again, use the command below to return to the TUQuiet directory:
```
cd ..
```

Then, move to the frontend directory with the following command:
```
cd frontend
```

Now, run the following commands to start the frontend:
```
npm install
npm run dev
```

After the backend and frontend are working, navigate to localhost:5173 to view the TUQuiet webpage.

# How to contribute

Follow this project board to know the latest status of the project: https://github.com/orgs/cis3296s25/projects/56/views/1?filterQuery=
