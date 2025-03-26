# TUQuiet

TUQuiet is a simple web app that helps Temple students find the best study spaces on campus through real-time peer reporting. Currently, students can quickly report and view noise levels and crowdedness of popular study locations. In the future, the system will recommend the most suitable spots based on the current conditions.

![image](https://github.com/user-attachments/assets/55d1c3d7-1205-4492-8575-e5082087debc)

# How to run

To run this repo, you will need working JDK and Node.js installations (see links below). If you are installing Node.js or a JDK, the following commands can be helpful to check you have installed them properly:

```
node -v
java -version
```

Once you have the installations complete, follow the instructions below to run a local version of TUQuiet. 

FIRST

Download the binary files from the most recent release of TUQuiet
Uncompress them in your file explorer, or on the command line using:
```
unzip tuquiet-0.1.0.zip
```

THEN

Open the new tuquiet-0.1.0 folder in an IDE. This has only been tested in Visual Studio Code, but should work in other IDEs which can run Java projects and ReactJS. 

Open a new terminal to run the backend code.
Ensure that you are in the correct folder by running the ls command. The output should look like this:
```
$ ls
frontend/  tuquiet-0.1.0-SNAPSHOT.jar
```

Now, to run the Spring Boot backend, run this command in your terminal:
```
java -jar tuquiet-0.1.0-SNAPSHOT.jar
```

Open a second terminal, and navigate to the same folder that you ran the backend in.
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

# Links for JDK and Node.js installation

https://www.oracle.com/java/technologies/downloads/#jdk24-mac (JDK - Mac)
https://www.oracle.com/java/technologies/downloads/#jdk24-windows (JDK - Windows)
https://nodejs.org/en/download (Node)

# How to contribute

Follow this project board to know the latest status of the project: https://github.com/orgs/cis3296s25/projects/56/views/1?filterQuery=
