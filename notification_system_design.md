# Stage 1 — Notification System API Design

## Overview

The Campus Notification Platform enables students to receive real-time notifications related to:

- Placements
- Events
- Results

The system supports:

- Notification creation
- Notification retrieval
- Marking notifications as read
- Bulk notifications
- Real-time notification delivery
- Unread notification count

The platform assumes users are pre-authorized and therefore does not require authentication APIs like login or signup.

---

# Base URL

```http
http://localhost:3000/api
```

---

# Notification Object Structure

```json
{
  "id": "uuid",
  "studentId": 1042,
  "type": "Placement",
  "message": "Amazon is hiring for SDE roles",
  "isRead": false,
  "createdAt": "2026-05-09T10:00:00Z",
  "updatedAt": "2026-05-09T10:00:00Z"
}
```

---

# Supported Notification Types

| Type | Description |
|---|---|
| Placement | Placement related updates |
| Event | College events |
| Result | Exam results |

---

# Common Headers

## Request Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

---

# REST API Endpoints

---

# 1. Get All Notifications

## Endpoint

```http
GET /api/notifications
```

## Description

Fetch notifications for a student with pagination and filtering.

---

## Query Parameters

| Parameter | Type | Description |
|---|---|---|
| studentId | number | Student ID |
| page | number | Page number |
| limit | number | Number of records |
| type | string | Notification type |

---

## Example Request

```http
GET /api/notifications?studentId=1042&page=1&limit=10&type=Placement
```

---

## Response

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 120,
  "data": [
    {
      "id": "a1b2c3",
      "studentId": 1042,
      "type": "Placement",
      "message": "Amazon hiring drive",
      "isRead": false,
      "createdAt": "2026-05-09T10:00:00Z"
    }
  ]
}
```

---

# 2. Get Notification By ID

## Endpoint

```http
GET /api/notifications/:id
```

---

## Example Request

```http
GET /api/notifications/a1b2c3
```

---

## Response

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3",
    "studentId": 1042,
    "type": "Placement",
    "message": "Amazon hiring drive",
    "isRead": false,
    "createdAt": "2026-05-09T10:00:00Z"
  }
}
```

---

# 3. Create Notification

## Endpoint

```http
POST /api/notifications
```

---

## Description

Create a notification for a single student.

---

## Request Body

```json
{
  "studentId": 1042,
  "type": "Placement",
  "message": "Amazon hiring drive"
}
```

---

## Response

```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "id": "a1b2c3"
  }
}
```

---

# 4. Bulk Notification API

## Endpoint

```http
POST /api/notifications/bulk
```

---

## Description

Send notification to multiple students.

---

## Request Body

```json
{
  "studentIds": [1042, 1043, 1044],
  "type": "Placement",
  "message": "TCS recruitment drive tomorrow"
}
```

---

## Response

```json
{
  "success": true,
  "message": "Bulk notifications queued successfully"
}
```

---

# 5. Mark Notification As Read

## Endpoint

```http
PATCH /api/notifications/:id/read
```

---

## Example Request

```http
PATCH /api/notifications/a1b2c3/read
```

---

## Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 6. Get Unread Notification Count

## Endpoint

```http
GET /api/notifications/unread/count
```

---

## Query Parameters

| Parameter | Type |
|---|---|
| studentId | number |

---

## Example Request

```http
GET /api/notifications/unread/count?studentId=1042
```

---

## Response

```json
{
  "success": true,
  "unreadCount": 12
}
```

---

# Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid notification type"
  }
}
```

---

# Real-Time Notification Mechanism

## Technology Suggested

- WebSockets using Socket.IO

---

# Why WebSockets?

| Feature | Benefit |
|---|---|
| Real-time communication | Instant notification delivery |
| Persistent connection | Reduced repeated HTTP calls |
| Low latency | Faster user experience |
| Bidirectional communication | Supports acknowledgements |

---

# Real-Time Notification Flow

```text
Admin/HR creates notification
            ↓
Backend Notification Service
            ↓
Database Storage
            ↓
Socket.IO Server
            ↓
Connected Student Clients
            ↓
Notification Displayed Instantly
```

---

# Socket Events

## Client Connection

```javascript
socket.emit("join", {
    studentId: 1042
});
```

---

## Server Push Event

```javascript
socket.emit("new_notification", {
    id: "a1b2c3",
    type: "Placement",
    message: "Amazon hiring drive"
});
```

---

# Logging Middleware Usage

All APIs must use the custom logging middleware developed in the pre-test setup.

The middleware will log:

- API requests
- API responses
- Errors
- Warning messages
- Database failures
- Real-time delivery failures

No inbuilt console logging mechanisms should be used.

---

# Additional Design Considerations

| Feature | Approach |
|---|---|
| Pagination | limit + page |
| Filtering | Query parameters |
| Scalability | Queue-based architecture |
| Reliability | Retry mechanisms |
| Performance | Indexed queries |
| Security | Bearer token authorization |
| Availability | Async notification delivery |