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
import java.sql.SQLException;
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
            if (response.getBody() instanceof Map<?, ?> responseMap) {
                assertEquals("success", responseMap.get("status"));
                assertTrue(responseMap.get("averages") instanceof Map<?, ?>);
                assertEquals(1, ((Map<?, ?>) responseMap.get("averages")).get("avgCrowd"));
            } else {
                fail("Unexpected response type");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            fail("Unexpected SQLException");
        }
    }
}
