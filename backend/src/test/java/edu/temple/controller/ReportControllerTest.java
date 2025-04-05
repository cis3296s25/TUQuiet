package edu.temple.controller;

import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;

import edu.temple.config.DatabaseConfig;

@ExtendWith(MockitoExtension.class)
public class ReportControllerTest {
    @InjectMocks
    private ReportController reportController;

    @Mock
    private Logger logger;
    @Mock
    private DatabaseConfig databaseConfig;
    @Mock
    private Connection mockConnection;
    @Mock
    private PreparedStatement mockStatement;

    @BeforeAll
    void setupDatabaseMock(){
        when(databaseConfig.getDbUrl()).thenReturn("mockURL");
        when(databaseConfig.getDbUser()).thenReturn("mockUser");
        when(databaseConfig.getDbPass()).thenReturn("mockPassword");
    }

    @Test
    void testSubmitReport(){
        mockDriverManager();
        
    }

    //Test Helper method for Driver Manager
    private void mockDriverManager(){
        MockedStatic<DriverManager> mockDriverManager = Mockito.mockStatic(DriverManager.class);
        mockDriverManager.when(() -> DriverManager.getConnection("mockURL", "mockUser", "mockPassword"))
            .thenReturn(mockConnection);
        try {
            when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockStatement);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    
}
