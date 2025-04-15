package edu.temple.model;

public class UpdateMessage {
    private String type;
    private String entityId;
    private Object data;
    private String action;

    public UpdateMessage() {
    }

    public UpdateMessage(String type, String entityId, Object data, String action) {
        this.type = type;
        this.entityId = entityId;
        this.data = data;
        this.action = action;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
} 