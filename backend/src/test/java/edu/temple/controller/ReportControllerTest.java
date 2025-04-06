package edu.temple.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
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
public class ReportControllerTest {
    private DatabaseConfig mockConfig;
    private ReportController controller;

    @BeforeEach
    void setup() {
        mockConfig = Mockito.mock(DatabaseConfig.class);
        when(mockConfig.getDbUrl()).thenReturn("mockURL");
        when(mockConfig.getDbUser()).thenReturn("mockUser");
        when(mockConfig.getDbPass()).thenReturn("mockPassword");
        controller = new ReportController(mockConfig);
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
            assertEquals("success", responseMap.get("status"));
            assertTrue(responseMap.get("averages") instanceof Map<?, ?>);
            assertEquals(1, ((Map<?, ?>) responseMap.get("averages")).get("avgCrowd"));
        } catch (SQLException e) {
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
                Timestamp.valueOf("2024-04-06 10:15:00"),
                Timestamp.valueOf("2024-04-06 10:45:00")
            );
            when(mockResultSet.getInt("NoiseLevel")).thenReturn(4, 6);
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
            assertEquals(5.0, hour10.get("noise"));  // average of 4 and 6
            assertEquals(4.0, hour10.get("crowd"));  // average of 3 and 5

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
}
