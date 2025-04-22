 
<div align="center">
    <img src="https://github.com/user-attachments/assets/3c2a2ea7-0164-491d-a5d2-e1d2e4a72bc6" width="320">
</div>

TUQuiet is a web app designed to help Temple students find the best study spots on campus through real time, crowd sourced reports. Students can view and submit updates on noise levels and crowdedness, with accuracy enhanced by an exponential decay algorithm that prioritizes recent data. Instantly see ranked locations to find the quietest spot for focused studying. TUQuiet also helps you connect with others preparing for big exams, making it easier to form study groups.

<div align="center">
  <img width = "49%" src="https://github.com/user-attachments/assets/a8149195-8f0f-4d5d-9815-5e592d0df4c0">
    <img width = "49%" src="https://github.com/user-attachments/assets/71ba595e-2517-4d99-942a-13b5836d311f">
</div>
<div align="center">
  <img width = "49%" src="https://github.com/user-attachments/assets/47eb5726-d797-456e-9e05-951b41646be5">
    <img width = "49%" src="https://github.com/user-attachments/assets/5878ad2b-bcf4-4cdb-8b29-bed089be0828">
</div>









---
# **Try Our Web App**
To try our fully functional web app please visit: https://tuquiet.onrender.com

---

# **How to Run**

To run this project, you'll need to have **JDK** and **Node.js** installed on your system. Use the following commands to verify your installations:

```
node -v
java -version
```

If either is not installed, follow the links below to download and install them:

- [Download Node.js](https://nodejs.org/en/download)
- [Download JDK](https://www.oracle.com/java/technologies/downloads/)

Once you have the installations complete, follow the instructions below to run TUQuiet locally.  

---

# **Steps to Run the Project**

## **Option 1: Use Database that is already live (Recommended)**

### **Step 1: Download and Extract the Release**
1. **Download** the latest release of TUQuiet.
2. **Unzip** the release. You should see the following folder structure:

```
tuquiet-X.X.X/
│── backend/
│   └── tuquiet-1.0-SNAPSHOT.jar
│── frontend/
│   └── (frontend source files)
```

### **Step 2: Run the Backend**



1. **Open a terminal** and navigate to the unzipped folder, then cd into the **backend** folder:
    ```sh
    cd backend
    ```

2. **Set up environment variables** for the database credentials (IMPORTANT: [REQUEST CREDENTIALS](https://forms.gle/DBee8DzGtfYH4AgV7)):
   
    **Windows (PowerShell)** 
    ```powershell
    $env:DB_URL="put_the_url_here"
    $env:DB_USER="put_the_username_here"
    $env:DB_PASS="put_the_password_here"

    java -jar tuquiet-1.0-SNAPSHOT.jar
    ```

    **Mac/Linux (Terminal)**
    ```sh
    export DB_URL="put_the_url_here"
    export DB_USER="put_the_username_here"
    export DB_PASS="put_the_password_here"

    java -jar tuquiet-1.0-SNAPSHOT.jar
    ```

    > **Note**: These environment variables need to be set in the same terminal session. The credentials will be sent to you privately via email.

3. **Keep this terminal open** to keep the backend running.

### **Step 3: Run the Frontend**
1. **Open another terminal** while keeping the backend terminal running.
2. Navigate to the **frontend** directory:

    ```sh
    cd frontend
    ```

3. **Install dependencies** and run the frontend:

    ```sh
    npm install
    npm run dev
    ```

    > The frontend should now be running on **localhost:5173**.

## **Option 2: Create Your Own Neon Database**

### Step 1: Follow Steps 1 and 2 in the [Neon Setup Guide](https://neon.tech/docs/get-started-with-neon/signing-up)

### Step 2: Once you reach step 3, use the files in this repository's sqlFiles folder to create your sample data, by pasting the information into Neon's Sql Editor.

***Note:*** It may be helpful to check that the tables and locations have been created in Neon's Tables tab after each step.

**First**, run the CreateTables.sql script.

**Then**, run the CreateLocation.sql script.

**Finally**, run the createSampleReports.sql script.

### Step 3: View the information in the [Obtaining Connection Details](https://neon.tech/docs/get-started-with-neon/connect-neon) section of this guide.

Using your connection string, follow the steps in option 1 to set up your version of TUQuiet.

In Step 2, setting up the environment variables, your environment variables should look like this:

**Windows (PowerShell)** 

    $env:DB_URL="jdbc:postgresql://[everything after the at sign in neon url]"
    $env:DB_USER="[neon username]"
    $env:DB_PASS="[neon password]"

    java -jar tuquiet-1.0-SNAPSHOT.jar

**Mac/Linux (Terminal)**
    
    export DB_URL="jdbc:postgresql://[everything after the at sign in neon url]"
    export DB_USER="[neon username]"
    export DB_PASS="[neon password]"

    java -jar tuquiet-1.0-SNAPSHOT.jar

---

# **How to Contribute**

TUQuiet utilizes Apache Maven to develop with Spring Boot. To install Maven, visit [this link](https://maven.apache.org/install.html).
Other required technologies are Node.js and a JDK (for users using Java 25+, please view the added setup at the end of this section), whose install links can be found in the How To Run section.

To run the project's code locally, first fork this repository, then clone it using

 ```sh
 git clone [repository link]
 ```

TUQuiet development requires a PostgresSQL database. Neon's free tier was used for the development of this project, and can be set up with some sample data by following the instructions in the How To Run Option 2 section. 

TUQuiet requires database keys to work. Once you have obtained the database keys from Neon, they can be placed in your backend\src\main\resources\application.properties file like so. Do not place quotes around the variables:

```code
spring.datasource.url=[your database URL]
spring.datasource.username=[your database username]
spring.datasource.password=[your database password]
```

If you do decide to change the application.properties file, make sure to not commit your keys to public repository. Alternatively, you can use the temporary environment terminal settings above. 

You will need a Java compatible IDE and access to the command line. Make sure you have a CLI open, then run these commands to begin running the backend (if you are using JDK 25+, view the For Java 25+ Users section below, or run "mvn clean install -DskipTests" instead of "mvn clean install"):

```sh
cd backend
mvn clean install
mvn spring-boot:run
```

Then, open a second terminal and follow these commands to run the frontend:

```sh
cd frontend
npm install
npm run dev
```

Now, you should have a locally running version of TUQuiet.

## Unit Testing

TUQuiet utilizes JUnit and ViTest as its testing frameworks. To run the ViTest tests, use the commands:

```sh
cd frontend
npm run test
```

To run the tests in JUnit, use the commands:

```sh
cd backend
mvn test
```

## For Java 25+ Users

TUQuiet uses a framework called Mockito for testing with JUnit, which has a helper called ByteBuddy. These are developed after Java versions are released, and do not always support the most updated version of Java. To change the versions of Mockito and Bytebuddy in use, visit the backend\pom.xml file.

Once you are in the backend\pom.xml file, find the dependencies for Mockito and Bytebuddy. They should start like this:

```
<dependency>
      <groupId>org.mockito</groupId>

<dependency>
      <groupId>net.bytebuddy</groupId>
```

These dependencies will have a version tag which needs to be changed. The version tag should be updated to a version of Mockito, ByteBuddy, and ByteBuddy Agent(same version as ByteBuddy) which is supported by Spring Boot and supports your version of Java. Here are the links to find the release notes for the most recent versions of [Mockito](https://github.com/mockito/mockito/releases), [ByteBuddy](https://github.com/raphw/byte-buddy/blob/master/release-notes.md), and the versions of them which Maven currently supports ([Mockito](https://mvnrepository.com/artifact/org.mockito/mockito-core), [ByteBuddy](https://mvnrepository.com/artifact/net.bytebuddy/byte-buddy)).
