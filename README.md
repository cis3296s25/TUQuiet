# **TUQuiet**

TUQuiet is a simple web app that helps Temple students find the best study spaces on campus through real-time peer reporting. Students can report and view noise levels and crowdedness in popular study locations. In the future, the system will recommend the most suitable spots based on current conditions.

![image](https://github.com/user-attachments/assets/f1f583a8-315d-4d9c-a5b4-ac7d5f260f82)

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

To follow the latest status of the project and get involved, visit the project board:  
[Project Board - TUQuiet](https://github.com/orgs/cis3296s25/projects/56/views/1?filterQuery=)

