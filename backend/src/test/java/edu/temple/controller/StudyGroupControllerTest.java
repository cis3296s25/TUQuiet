package edu.temple.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import edu.temple.config.DatabaseConfig;

@SpringBootTest
public class StudyGroupControllerTest {
    private DatabaseConfig mockConfig;
    private StudyGroupController controller;

    @BeforeEach
    void setup() {
        mockConfig = Mockito.mock(DatabaseConfig.class);
        when(mockConfig.getDbUrl()).thenReturn("mockURL");
        when(mockConfig.getDbUser()).thenReturn("mockUser");
        when(mockConfig.getDbPass()).thenReturn("mockPassword");
        controller = new StudyGroupController(mockConfig);
    }

    @Test
    void testSubmitStudyGroup() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement mockStatement = mock(PreparedStatement.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);

            when(mockConnection.prepareStatement(Mockito.startsWith("INSERT INTO STUDY_GROUP")))
                    .thenReturn(mockStatement);
            doNothing().when(mockStatement).setString(anyInt(), anyString());
            doNothing().when(mockStatement).setTimestamp(anyInt(), any());
            doNothing().when(mockStatement).setInt(anyInt(), anyInt());
            when(mockStatement.executeUpdate()).thenReturn(1);

            Map<String, Object> group = Map.of(
                    "courseCode", "CIS101",
                    "name", "Alice",
                    "major", "CS",
                    "title", "Study Session",
                    "description", "Let's prepare for the exam",
                    "date", "2024-04-20",
                    "time", "15:00:00",
                    "location", "Library",
                    "participantsMax", 5);

            ResponseEntity<?> response = controller.submitStudyGroup(group);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));
            assertEquals("group created", body.get("message"));
        }
    }

    @Test
    void testGetStudyGroups() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement groupStatement = mock(PreparedStatement.class);
            ResultSet groupResultSet = mock(ResultSet.class);
            PreparedStatement commentStatement = mock(PreparedStatement.class);
            ResultSet commentResultSet = mock(ResultSet.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);

            when(mockConnection.prepareStatement(Mockito.startsWith("SELECT * FROM study_group")))
                    .thenReturn(groupStatement);
            when(groupStatement.executeQuery()).thenReturn(groupResultSet);

            when(groupResultSet.next()).thenReturn(true).thenReturn(false);
            when(groupResultSet.getInt("StudyGroupID")).thenReturn(1);
            when(groupResultSet.getString("CourseCode")).thenReturn("CIS101");
            when(groupResultSet.getTimestamp("PostedAt")).thenReturn(Timestamp.valueOf("2024-04-10 10:00:00"));
            when(groupResultSet.getString("NameOfPoster")).thenReturn("Alice");
            when(groupResultSet.getString("MajorOfPoster")).thenReturn("CS");
            when(groupResultSet.getString("Title")).thenReturn("Exam Review");
            when(groupResultSet.getString("Content")).thenReturn("Let's review for the test.");
            when(groupResultSet.getString("MeetingPlace")).thenReturn("Library");
            when(groupResultSet.getInt("ParticipantsCurrent")).thenReturn(2);
            when(groupResultSet.getInt("ParticipantsMax")).thenReturn(5);
            when(groupResultSet.getInt("Likes")).thenReturn(3);
            when(groupResultSet.getTimestamp("MeetingDate")).thenReturn(Timestamp.valueOf("2024-04-20 15:00:00"));

            when(mockConnection.prepareStatement(Mockito.startsWith("SELECT * FROM comment")))
                    .thenReturn(commentStatement);
            when(commentStatement.executeQuery()).thenReturn(commentResultSet);

            when(commentResultSet.next()).thenReturn(true).thenReturn(false);
            when(commentResultSet.getInt("CommentID")).thenReturn(101);
            when(commentResultSet.getString("NameOfPoster")).thenReturn("Bob");
            when(commentResultSet.getTimestamp("TimeOfComment")).thenReturn(Timestamp.valueOf("2024-04-11 12:00:00"));
            when(commentResultSet.getString("Content")).thenReturn("I’m interested!");

            ResponseEntity<?> response = controller.getStudyGroups();

            assertEquals(HttpStatus.OK, response.getStatusCode());
            List<?> resultList = (List<?>) response.getBody();
            assertEquals(1, resultList.size());

            Map<?, ?> group = (Map<?, ?>) resultList.get(0);
            assertEquals("CIS101", group.get("courseCode"));
            assertEquals("Alice", group.get("name"));
            assertEquals("Library", group.get("location"));
            assertEquals(1, ((List<?>) group.get("comments")).size());
        }
    }

    @Test
    void testSubmitComment() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement mockStatement = mock(PreparedStatement.class);
            ResultSet mockResultSet = mock(ResultSet.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);
            when(mockConnection.prepareStatement(anyString())).thenReturn(mockStatement);
            when(mockStatement.getGeneratedKeys()).thenReturn(mockResultSet);
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getInt("CommentID")).thenReturn(101);

            Integer groupId = 1;
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("author", "Alice");
            commentMap.put("content", "Excited to join!");

            ResponseEntity<?> response = controller.submitComment(commentMap, groupId);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));

            Map<?, ?> returnedComment = (Map<?, ?>) body.get("comment");
            assertEquals(101, returnedComment.get("id"));
            assertEquals("Alice", returnedComment.get("author"));
            assertEquals("Excited to join!", returnedComment.get("content"));
            assertNotNull(returnedComment.get("timestamp"));
        }
    }

    @Test
    void testSubmitAutoJoinComment() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement insertStatement = mock(PreparedStatement.class);
            PreparedStatement updateStatement = mock(PreparedStatement.class);
            ResultSet mockResultSet = mock(ResultSet.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);

            when(mockConnection.prepareStatement(startsWith("INSERT"), eq(Statement.RETURN_GENERATED_KEYS)))
                    .thenReturn(insertStatement);
            when(insertStatement.getGeneratedKeys()).thenReturn(mockResultSet);
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getInt("CommentID")).thenReturn(202);

            when(mockConnection.prepareStatement(startsWith("UPDATE"))).thenReturn(updateStatement);

            Integer groupId = 2;
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("author", "Bob");
            commentMap.put("content", "I'll be there!");

            ResponseEntity<?> response = controller.submitAutoJoinComment(commentMap, groupId);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));

            Map<?, ?> returnedComment = (Map<?, ?>) body.get("comment");
            assertEquals(202, returnedComment.get("id"));
            assertEquals("Bob", returnedComment.get("author"));
            assertEquals("I'll be there!", returnedComment.get("content"));
            assertNotNull(returnedComment.get("timestamp"));
        }
    }

    @Test
    void testDeleteAutoJoinComment() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement mockStatement = mock(PreparedStatement.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);
            when(mockConnection.prepareStatement(Mockito.startsWith("DELETE FROM comment"))).thenReturn(mockStatement);
            when(mockConnection.prepareStatement(Mockito.startsWith("UPDATE study_group SET ParticipantsCurrent")))
                    .thenReturn(mockStatement);
            when(mockStatement.executeUpdate()).thenReturn(1);

            ResponseEntity<?> response = controller.deleteAutoJoinComment(1, 101);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));
        }
    }

    @Test
    void testLike() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement mockStatement = mock(PreparedStatement.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);
            when(mockConnection.prepareStatement(Mockito.startsWith("UPDATE study_group SET Likes = Likes+1")))
                    .thenReturn(mockStatement);
            when(mockStatement.executeUpdate()).thenReturn(1);

            ResponseEntity<?> response = controller.like(42);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));
            assertEquals(1, body.get("rowsUpdated"));
        }
    }

    @Test
    void testRemoveLike() throws Exception {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            PreparedStatement mockStatement = mock(PreparedStatement.class);

            mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
                    .thenReturn(mockConnection);
            when(mockConnection.prepareStatement(Mockito.startsWith("UPDATE study_group SET Likes = Likes-1")))
                    .thenReturn(mockStatement);
            when(mockStatement.executeUpdate()).thenReturn(1);

            ResponseEntity<?> response = controller.removeLike(77);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertEquals("success", body.get("status"));
            assertEquals(1, body.get("rowsUpdated"));
        }
    }

}
