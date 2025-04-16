package edu.temple.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.temple.config.DatabaseConfig;
import edu.temple.service.WebSocketService;

@RestController
@RequestMapping("/api/studyGroups")
@CrossOrigin(origins = "*")
public class StudyGroupController {
    private static final Logger logger = LoggerFactory.getLogger(StudyGroupController.class);
    private final DatabaseConfig databaseConfig;
    private final WebSocketService webSocketService;

    @Autowired
    public StudyGroupController(DatabaseConfig databaseConfig, WebSocketService webSocketService) {
        this.databaseConfig = databaseConfig;
        this.webSocketService = webSocketService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> submitStudyGroup(@RequestBody Map<String, Object> group) {
        String courseCode = group.get("courseCode").toString();
        String name = group.get("name").toString();
        String major = group.get("major").toString();
        String title = group.get("title").toString();
        String description = group.get("description").toString();
        String dateString = group.get("date").toString();
        String timeString = group.get("time").toString();
        Timestamp timeOfMeeting = Timestamp.valueOf(LocalDateTime.parse(dateString + "T" + timeString));
        String location = group.get("location").toString();
        Integer participantsMax = Integer.parseInt(group.get("participantsMax").toString());

        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            String sql = "INSERT INTO STUDY_GROUP (CourseCode, PostedAt, NameOfPoster, MajorOfPoster, Title, Content, MeetingDate, MeetingPlace, ParticipantsMax) "
                    +
                    "VALUES(?, (CURRENT_TIMESTAMP AT TIME ZONE 'EST'), ?, ?, ?, ?, ?, ?, ?);";

            statement = conn.prepareStatement(sql);
            statement.setString(1, courseCode);
            statement.setString(2, name);
            statement.setString(3, major);
            statement.setString(4, title);
            statement.setString(5, description);
            statement.setTimestamp(6, timeOfMeeting);
            statement.setString(7, location);
            statement.setInt(8, participantsMax);

            statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "group created"));
                    
            // notify that a new study group has been added
            webSocketService.sendStudyGroupsUpdate();

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }

    @GetMapping("/getGroups")
    public ResponseEntity<?> getStudyGroups(){
        Connection conn = null;
        PreparedStatement statement = null;
        List<Map<String, Object>> studyGroupList = new ArrayList<Map<String,Object>>();

        try {
            conn = DriverManager.getConnection(
                databaseConfig.getDbUrl(),
                databaseConfig.getDbUser(),
                databaseConfig.getDbPass()
            );

            String sql = "SELECT * FROM study_group WHERE MeetingDate > (CURRENT_TIMESTAMP AT TIME ZONE 'EST');";
            statement = conn.prepareStatement(sql);
            ResultSet rs = statement.executeQuery();
            while(rs.next()){
                Map<String, Object> studyGroupData = new HashMap<String, Object>();
                studyGroupData.put("id", rs.getInt("StudyGroupID"));
                studyGroupData.put("courseCode", rs.getString("CourseCode"));
                studyGroupData.put("postedAt", rs.getTimestamp("PostedAt"));
                studyGroupData.put("name", rs.getString("NameOfPoster"));
                studyGroupData.put("major", rs.getString("MajorOfPoster"));
                studyGroupData.put("title", rs.getString("Title"));
                studyGroupData.put("description", rs.getString("Content"));
                studyGroupData.put("location", rs.getString("MeetingPlace"));
                studyGroupData.put("participantsCurrent", rs.getInt("ParticipantsCurrent"));
                studyGroupData.put("participantsMax", rs.getInt("ParticipantsMax"));
                studyGroupData.put("likes", rs.getInt("Likes"));

                Timestamp meetingDate = rs.getTimestamp("MeetingDate");
                studyGroupData.put("date", meetingDate.toLocalDateTime().toLocalDate());
                studyGroupData.put("time", meetingDate.toLocalDateTime().toLocalTime());

                String commentSql = "SELECT * FROM comment WHERE StudyGroupID = ?;";
                PreparedStatement commentStatement = conn.prepareStatement(commentSql);
                commentStatement.setInt(1, rs.getInt("StudyGroupID"));
                List<Map<String, Object>> comments = new ArrayList<Map<String,Object>>();

                ResultSet crs = commentStatement.executeQuery();
                if (crs.next()) {
                    do {
                        Map<String, Object> commentData = new HashMap<>();
                        commentData.put("id", crs.getInt("CommentID"));
                        commentData.put("author", crs.getString("NameOfPoster"));
                        commentData.put("timestamp", crs.getTimestamp("TimeOfComment"));
                        commentData.put("content", crs.getString("Content"));
                        comments.add(commentData);
                    } while (crs.next());
                }
                studyGroupData.put("comments", comments);
                
                commentStatement.close();

                studyGroupList.add(studyGroupData);
            }

        } catch (SQLException e) {
            logger.error("SQL Error while fetching predictions: {}", e.toString());
            return ResponseEntity.status(500).body(Map.of(
                "status", "failure",
                "message", e.toString()
            ));
        } finally {
            try {
                if (statement != null) statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }


        return ResponseEntity.ok(studyGroupList);
    }

    @PostMapping("/submitComment/{groupId}")
    public ResponseEntity<?> submitComment(@RequestBody Map<String, Object> comment, @PathVariable Integer groupId) {
        String name = comment.get("author").toString();
        String content = comment.get("content").toString();
        

        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            String sql = "INSERT INTO COMMENT (StudyGroupID, TimeOfComment, NameOfPoster, Content) "
                    +
                    "VALUES(?, (CURRENT_TIMESTAMP AT TIME ZONE 'EST'), ?, ?);";

            statement = conn.prepareStatement(sql);
            statement.setInt(1, groupId);
            statement.setString(2, name);
            statement.setString(3, content);

            statement.executeUpdate();

            ResultSet rs = statement.getGeneratedKeys();
            int generatedId = -1;
            if(rs.next()){
                generatedId = rs.getInt("CommentID");
            }

            Map<String, Object> commentReturnMap = new HashMap<String, Object>();
            commentReturnMap.put("id", generatedId);
            commentReturnMap.put("author", name);
            commentReturnMap.put("timestamp", LocalDateTime.now());
            commentReturnMap.put("content", content);

            r = ResponseEntity.ok(Map.of(
                "status", "success",
                "comment", commentReturnMap
            ));
            
            // notify that a new comment has been added
            webSocketService.sendStudyGroupUpdate(groupId.toString(), commentReturnMap, "COMMENT_ADDED");

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }
    
    @PostMapping("/submitAutoJoinComment/{groupId}")
    public ResponseEntity<?> submitAutoJoinComment(@RequestBody Map<String, Object> comment, @PathVariable Integer groupId) {
        String name = comment.get("author").toString();
        String content = comment.get("content").toString();
        

        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            String sql = "INSERT INTO COMMENT (StudyGroupID, TimeOfComment, NameOfPoster, Content) "
                    +
                    "VALUES(?, (CURRENT_TIMESTAMP AT TIME ZONE 'EST'), ?, ?);";

            statement = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, groupId);
            statement.setString(2, name);
            statement.setString(3, content);

            statement.executeUpdate();

            ResultSet rs = statement.getGeneratedKeys();
            int generatedId = -1;
            if(rs.next()){
                generatedId = rs.getInt("CommentID");
            }

            Map<String, Object> commentReturnMap = new HashMap<String, Object>();
            commentReturnMap.put("id", generatedId);
            commentReturnMap.put("author", name);
            commentReturnMap.put("timestamp", LocalDateTime.now());
            commentReturnMap.put("content", content);

            statement.close();
            sql = "UPDATE study_group SET ParticipantsCurrent = ParticipantsCurrent+1 WHERE StudyGroupID = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, groupId);
            statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
                "status", "success",
                "comment", commentReturnMap
            ));
            
            // notify that a new comment has been added and the number of participants has increased
            webSocketService.sendStudyGroupUpdate(groupId.toString(), commentReturnMap, "COMMENT_ADDED");
            webSocketService.sendStudyGroupUpdate(groupId.toString(), Map.of("participantsCurrent", "+1"), "PARTICIPANTS_UPDATED");

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }


    @PostMapping("/deleteAutoJoinComment/{groupId}/{commentId}")
    public ResponseEntity<?> deleteAutoJoinComment(@PathVariable Integer groupId, @PathVariable Integer commentId) {
        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            String sql = "DELETE FROM comment WHERE CommentID = ?;";

            statement = conn.prepareStatement(sql);
            statement.setInt(1, commentId);
            statement.executeUpdate();
            statement.close();

            sql = "UPDATE study_group SET ParticipantsCurrent = ParticipantsCurrent-1 WHERE StudyGroupID = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, groupId);
            statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
                "status", "success"
            ));
            
            // notify that a participant has left
            webSocketService.sendStudyGroupUpdate(groupId.toString(), Map.of(
                "commentId", commentId,
                "participantsCurrent", "-1"
            ), "PARTICIPANT_LEFT");

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }

    @PostMapping("/like/{groupId}")
    public ResponseEntity<?> like(@PathVariable Integer groupId) {
        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            
            String sql = "UPDATE study_group SET Likes = Likes+1 WHERE StudyGroupID = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, groupId);
            int updated = statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
                "status", "success",
                "rowsUpdated", updated
            ));
            
            // notify that a like has been added
            webSocketService.sendStudyGroupUpdate(groupId.toString(), Map.of("likes", "+1"), "LIKES_UPDATED");

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }

    @PostMapping("/removeLike/{groupId}")
    public ResponseEntity<?> removeLike(@PathVariable Integer groupId) {
        Connection conn = null;
        PreparedStatement statement = null;
        ResponseEntity<?> r;

        try {
            conn = DriverManager.getConnection(
                    databaseConfig.getDbUrl(),
                    databaseConfig.getDbUser(),
                    databaseConfig.getDbPass());
            
            String sql = "UPDATE study_group SET Likes = Likes-1 WHERE StudyGroupID = ?;";
            statement = conn.prepareStatement(sql);
            statement.setInt(1, groupId);
            int updated = statement.executeUpdate();

            r = ResponseEntity.ok(Map.of(
                "status", "success",
                "rowsUpdated", updated
            ));
            
            // notify that a like has been removed
            webSocketService.sendStudyGroupUpdate(groupId.toString(), Map.of("likes", "-1"), "LIKES_UPDATED");

        } catch (SQLException e) {
            r = ResponseEntity.ok(Map.of(
                    "status", "failure",
                    "message", e.toString()));
        } finally {
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing statement", e);
            }
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                logger.error("SQL Exception occurred while closing connection", e);
            }
        }

        return r;
    }
}
