package edu.temple.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import edu.temple.model.UpdateMessage;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendStudyGroupUpdate(String groupId, Object data, String action) {
        UpdateMessage message = new UpdateMessage("STUDY_GROUP", groupId, data, action);
        messagingTemplate.convertAndSend("/topic/study-groups/" + groupId, message);
    }

    public void sendStudyGroupsUpdate() {
        UpdateMessage message = new UpdateMessage("STUDY_GROUPS", "all", null, "REFRESH");
        messagingTemplate.convertAndSend("/topic/study-groups", message);
    }

    public void sendStudySpotUpdate(String spotId, Object data, String action) {
        UpdateMessage message = new UpdateMessage("STUDY_SPOT", spotId, data, action);
        messagingTemplate.convertAndSend("/topic/study-spots/" + spotId, message);
    }

    public void sendStudySpotsUpdate() {
        UpdateMessage message = new UpdateMessage("STUDY_SPOTS", "all", null, "REFRESH");
        messagingTemplate.convertAndSend("/topic/study-spots", message);
    }
} 