package edu.temple.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import edu.temple.config.DatabaseConfig;
import edu.temple.service.WebSocketService;

@SpringBootTest
public class ReportControllerTest {
    private DatabaseConfig mockConfig;
    private WebSocketService mockWebSocketService;
    private ReportController controller;

    @BeforeEach
    void setup() {
        mockConfig = Mockito.mock(DatabaseConfig.class);
        mockWebSocketService = Mockito.mock(WebSocketService.class);
        when(mockConfig.getDbUrl()).thenReturn("mockURL");
        when(mockConfig.getDbUser()).thenReturn("mockUser");
        when(mockConfig.getDbPass()).thenReturn("mockPassword");
        doNothing().when(mockWebSocketService).sendStudySpotUpdate(anyString(), Mockito.any(), anyString());
        controller = new ReportController(mockConfig, mockWebSocketService);
    }

    @Test
    void testSubmitReport(){
        ReportController spyController = Mockito.spy(controller);

        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            PreparedStatement mockStatement = Mockito.mock(PreparedStatement.class);

            mockDriverManager.when(() ->
                DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
            ).thenReturn(mockConnection);

            when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockStatement);
            doNothing().when(mockStatement).setInt(anyInt(), anyInt());
            doNothing().when(mockStatement).setString(anyInt(), anyString());
            when(mockStatement.executeUpdate()).thenReturn(1);

            Map<String, Object> averageMock = Map.of("avgCrowd", 1);
            doReturn(averageMock).when(spyController).calculateAverages(3);

            Map<String, Object> report = Map.of(
                "locationId", 3,
                "noiseLevel", 4,
                "crowdLevel", 4,
                "description", ""
            );

            ResponseEntity<?> response = spyController.submitReport(report);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertTrue(response.getBody() instanceof Map<?, ?>);
            Map<?,?> responseMap = (Map<?,?>) response.getBody();
            assertTrue(responseMap instanceof Map<?, ?>);
            assertEquals("success", responseMap.get("status"));
            assertTrue(responseMap.get("averages") instanceof Map<?, ?>);
            assertEquals(1, ((Map<?, ?>) responseMap.get("averages")).get("avgCrowd"));
        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }

    @Test
    void testSubmitReportException() {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            mockDriverManager.when(() ->
                    DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
                ).thenReturn(mockConnection);

            doThrow(new SQLException("Expected Error")).when(mockConnection).prepareStatement(anyString());
            
            Map<String, Object> report = Map.of(
                "locationId", 3,
                "noiseLevel", 4,
                "crowdLevel", 4,
                "description", ""
            );

            ResponseEntity<?> response = controller.submitReport(report);

            assertEquals(HttpStatus.OK, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertNotNull(body);
            assertEquals("failure", body.get("status"));
            assertTrue(body.get("message").toString().contains("Expected"));
        }catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }

    @Test
    void testGetLocationAverages(){
        ReportController spyController = Mockito.spy(controller);

        Map<String, Object> averageMock = Map.of("avgCrowd", 1);
        doReturn(averageMock).when(spyController).calculateAverages(3);

        ResponseEntity<?> response = spyController.getLocationAverages(3);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        if (response.getBody() instanceof Map<?, ?> responseMap) {
            assertEquals(1, (responseMap.get("avgCrowd")));
        } else {
            fail("Unexpected response type");
        }
    }

    @Test
    void testGetLocationAveragesException(){
        ReportController spyController = Mockito.spy(controller);

        Map<String, Object> averageMock = Map.of("errorStatus", "ExpectedError");
        doReturn(averageMock).when(spyController).calculateAverages(3);

        ResponseEntity<?> response = spyController.getLocationAverages(3);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        if (response.getBody() instanceof Map<?, ?> responseMap) {
            assertEquals("failure", (responseMap.get("status")));
            assertEquals("ExpectedError", responseMap.get("message"));
        } else {
            fail("Unexpected response type");
        }
    }

    @Test
    void testCalculateAverages(){
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            PreparedStatement mockStatement = Mockito.mock(PreparedStatement.class);
            PreparedStatement mockTimestampStatement = Mockito.mock(PreparedStatement.class);
            ResultSet mockResultSet = Mockito.mock(ResultSet.class);
            ResultSet mockTimestampResultSet = Mockito.mock(ResultSet.class);

            mockDriverManager.when(() ->
                DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
            ).thenReturn(mockConnection);

            //likely point of failure on SQL statement change
            when(mockConnection.prepareStatement(Mockito.startsWith("SELECT COALESCE(SUM"))).thenReturn(mockStatement);
            when(mockStatement.executeQuery()).thenReturn(mockResultSet);
            when(mockResultSet.next()).thenReturn(true);
            when(mockResultSet.getDouble("WeightedNoiseLevel")).thenReturn(3.456);
            when(mockResultSet.getDouble("WeightedCrowdLevel")).thenReturn(4.876);
            when(mockResultSet.getInt("ReportCount")).thenReturn(2);

            //likely point of failure on SQL statement change
            when(mockConnection.prepareStatement(Mockito.startsWith("SELECT TimeOfReport"))).thenReturn(mockTimestampStatement);
            when(mockTimestampStatement.executeQuery()).thenReturn(mockTimestampResultSet);
            when(mockTimestampResultSet.next()).thenReturn(true);
            when(mockTimestampResultSet.getTimestamp("TimeOfReport"))
                .thenReturn(Timestamp.valueOf("2024-04-01 15:30:00"));

            Map<String, Object> result = controller.calculateAverages(1);

            assertEquals(3.5, result.get("averageNoiseLevel")); 
            assertEquals(4.9, result.get("averageCrowdLevel"));
            assertEquals(2, result.get("reportCount"));
            assertEquals("2024-04-01 15:30:00.0", result.get("lastReportTime"));
        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }

    @Test
    void testCalculateAveragesException() {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            mockDriverManager.when(() ->
                    DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
                ).thenReturn(mockConnection);

            doThrow(new SQLException("Expected Error")).when(mockConnection).prepareStatement(anyString());

            Map<String,Object> result = controller.calculateAverages(1);

            assertEquals("java.sql.SQLException: Expected Error", result.get("errorStatus"));
        }
        catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }

    @Test
    void testGetPredictedData(){
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            PreparedStatement mockStatement = Mockito.mock(PreparedStatement.class);
            ResultSet mockResultSet = Mockito.mock(ResultSet.class);

            mockDriverManager.when(() ->
                DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
            ).thenReturn(mockConnection);

            when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockStatement);
            when(mockStatement.executeQuery()).thenReturn(mockResultSet);

            when(mockResultSet.next()).thenReturn(true, true, false); 
            when(mockResultSet.getTimestamp("TimeOfReport")).thenReturn(
                Timestamp.valueOf("2024-04-06 14:15:00"),
                Timestamp.valueOf("2024-04-06 14:45:00")
            );
            when(mockResultSet.getInt("NoiseLevel")).thenReturn(3, 5);
            when(mockResultSet.getInt("CrowdLevel")).thenReturn(3, 5);

            ResponseEntity<?> response = controller.getPredictedData(1);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertTrue(response.getBody() instanceof List<?>);

            List<?> responseList = (List<?>) response.getBody();
            assertTrue(responseList instanceof List<?>);
            assertEquals(24, responseList.size());

            assertTrue(responseList.get(10) instanceof Map<?,?>);
            Map<?, ?> hour10 = (Map<?, ?>) responseList.get(10);
            assertEquals("10:00", hour10.get("time"));
            assertEquals(4.0, hour10.get("noise"));  
            assertEquals(4.0, hour10.get("crowd"));  

            for (int i = 0; i < 24; i++) {
                assertTrue(responseList.get(i) instanceof Map<?,?>);
                Map<?, ?> hour = (Map<?, ?>) responseList.get(i);
                assertEquals(String.format("%02d:00", i), hour.get("time"));
                if (i != 10) {
                    assertEquals(0.0, hour.get("noise"));
                    assertEquals(0.0, hour.get("crowd"));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException during test");
        }
    }

    @Test
    void testGetPredictedDataException() {
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            mockDriverManager.when(() ->
                    DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
                ).thenReturn(mockConnection);
            
            doThrow(new SQLException("Expected Error")).when(mockConnection).prepareStatement(anyString());

            ResponseEntity<?> response = controller.getPredictedData(1);

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

            Map<?, ?> body = (Map<?, ?>) response.getBody();
            assertNotNull(body);
            assertEquals("failure", body.get("status"));
            assertTrue(body.get("message").toString().contains("Expected"));
        }
        catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException during test");
        }

    }

    @Test
    void testGetAllRecommendations(){
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            PreparedStatement mockStatement = Mockito.mock(PreparedStatement.class);
            ResultSet mockResultSet = Mockito.mock(ResultSet.class);

            mockDriverManager.when(() ->
                DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
            ).thenReturn(mockConnection);

            long currentTime = System.currentTimeMillis();
            long later = currentTime + 5000;

            //likely point of failure on SQL statement change
            when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockStatement);
            doNothing().when(mockStatement).setInt(anyInt(), anyInt());
            when(mockStatement.executeQuery()).thenReturn(mockResultSet);

            when(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);

            when(mockResultSet.getInt("locationid")).thenReturn(1).thenReturn(1).thenReturn(2).thenReturn(2);
            when(mockResultSet.getString("locationname")).thenReturn("Loc1").thenReturn("Loc2");
            when(mockResultSet.getString("buildingname")).thenReturn("Charles Library").thenReturn("Charles Library");
            when(mockResultSet.getDouble("weighted_noise")).thenReturn(1.1).thenReturn(2.2);
            when(mockResultSet.getDouble("weighted_crowd")).thenReturn(1.5).thenReturn(3.9);
            when(mockResultSet.getInt("report_count")).thenReturn(5).thenReturn(12);
            when(mockResultSet.getTimestamp("last_report_time")).thenReturn(new Timestamp(currentTime)).thenReturn(new Timestamp(later));

            Timestamp ts = new Timestamp(currentTime);
            ZonedDateTime utcTime = ts.toLocalDateTime().atZone(ZoneId.of("UTC"));
            ZonedDateTime easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
            String time1 = easternTime.toLocalDateTime().toString();

            ts = new Timestamp(later);
            utcTime = ts.toLocalDateTime().atZone(ZoneId.of("UTC"));
            easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
            String time2 = easternTime.toLocalDateTime().toString();

            ResponseEntity<?> result = controller.getAllRecommendations();

            Map<String, Object> expected1 = Map.of(
                "id", 1,
                "locationId", 1,
                "name", "Loc1",
                "buildingName", "Charles Library",
                "averageNoiseLevel", 1.1,
                "averageCrowdLevel", 1.5,
                "reportCount", 5,
                "lastReportTime", time1
            );

            Map<String, Object> expected2 = Map.of(
                    "id", 2,
                    "locationId", 2,
                    "name", "Loc2",
                    "buildingName", "Charles Library",
                    "averageNoiseLevel", 2.2,
                    "averageCrowdLevel", 3.9,
                    "reportCount", 12,
                    "lastReportTime", time2
            );

            List<Map<String, Object>> expectedRecommendations = List.of(expected1, expected2);

            assertEquals(expectedRecommendations, result.getBody());

        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }

    @Test
    void testGetFeedData(){
        try (MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = Mockito.mock(Connection.class);
            PreparedStatement mockStatement = Mockito.mock(PreparedStatement.class);
            ResultSet mockResultSet = Mockito.mock(ResultSet.class);

            mockDriverManager.when(() ->
                DriverManager.getConnection("mockURL", "mockUser", "mockPassword")
            ).thenReturn(mockConnection);

            long currentTime = System.currentTimeMillis();
            long later = currentTime + 5000;

            //likely point of failure on SQL statement change
            when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockStatement);
            doNothing().when(mockStatement).setInt(anyInt(), anyInt());
            when(mockStatement.executeQuery()).thenReturn(mockResultSet);

            when(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);

            when (mockResultSet.getInt("ReportID")).thenReturn(1).thenReturn(2);
            when(mockResultSet.getString("LocationID")).thenReturn("1").thenReturn("2");
            when(mockResultSet.getString("LocationName")).thenReturn("Loc1").thenReturn("Loc2");
            when(mockResultSet.getString("BuildingName")).thenReturn("Charles Library").thenReturn("Charles Library");
            when(mockResultSet.getInt("NoiseLevel")).thenReturn(2).thenReturn(2);
            when(mockResultSet.getInt("CrowdLevel")).thenReturn(5).thenReturn(4);
            when(mockResultSet.getString("Description")).thenReturn("good").thenReturn("bad");
            when(mockResultSet.getTimestamp("TimeOfReport")).thenReturn(new Timestamp(currentTime)).thenReturn(new Timestamp(later));

            Timestamp timestamp = new Timestamp(currentTime);
            ZonedDateTime utcTime = timestamp.toLocalDateTime().atZone(ZoneId.of("UTC"));
            ZonedDateTime easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSSSS");
            String time1 = easternTime.format(formatter);
            

            timestamp = new Timestamp(later);
            utcTime = timestamp.toLocalDateTime().atZone(ZoneId.of("UTC"));
            easternTime = utcTime.withZoneSameInstant(ZoneId.of("America/New_York"));
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSSSS");
            String time2 = easternTime.format(formatter);

            ResponseEntity<?> result = controller.getFeedData(1);

            Map<String, Object> expected1 = Map.of(
                "id", 1,
                "locationId", "1",
                "locationName", "Loc1",
                "buildingName", "Charles Library",
                "noiseLevel", 2,
                "crowdLevel", 5,
                "description", "good",
                "timestamp", time1
            );

            Map<String, Object> expected2 = Map.of(
                "id", 2,
                "locationId", "2",
                "locationName", "Loc2",
                "buildingName", "Charles Library",
                "noiseLevel", 2,
                "crowdLevel", 4,
                "description", "bad",
                "timestamp", time2
            );

            assertEquals(List.of(expected1, expected2), result.getBody());

        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }
    
}
