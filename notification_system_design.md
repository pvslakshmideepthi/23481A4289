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
---

# Stage 2 — Database Design and Storage Strategy

    # Recommended Persistent Storage

    ## Suggested Database

    PostgreSQL is recommended as the primary persistent storage solution for the notification platform.

    ---

    # Why PostgreSQL?

    | Feature | Benefit |
    |---|---|
    | Relational structure | Suitable for student-notification relationships |
    | ACID compliance | Ensures reliable transactions |
    | Strong indexing support | Faster query performance |
    | Scalability | Handles large datasets efficiently |
    | JSON support | Flexible metadata storage |
    | Reliability | Production-ready and stable |

    ---

    # Database Schema Design

    ## 1. Students Table

    ```sql
    CREATE TABLE students (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

    ---

    ## 2. Notifications Table

    ```sql
    CREATE TABLE notifications (
        id UUID PRIMARY KEY,
        student_id BIGINT REFERENCES students(id),
        notification_type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

    ---

    # Notification Type Values

    ```text
    Placement
    Event
    Result
    ```

    ---

    # Database Relationships

    | Table | Relationship |
    |---|---|
    | students → notifications | One-to-Many |

    One student can have multiple notifications.

    ---

    # Indexing Strategy

    ## Composite Index

    ```sql
    CREATE INDEX idx_notifications_student_read_created
    ON notifications(student_id, is_read, created_at DESC);
    ```

    ---

    # Why This Index?

    This index improves performance for:

    - Fetching unread notifications
    - Sorting notifications
    - Pagination queries
    - Student-specific notification retrieval

    ---

    # Additional Useful Indexes

    ## Notification Type Index

    ```sql
    CREATE INDEX idx_notification_type
    ON notifications(notification_type);
    ```

    ---

    ## Created Time Index

    ```sql
    CREATE INDEX idx_created_at
    ON notifications(created_at DESC);
    ```

    ---

    # Problems as Data Volume Increases

    As the platform scales to thousands of students and millions of notifications, several performance problems may arise.

    ---

    # Potential Issues

    | Problem | Cause |
    |---|---|
    | Slow queries | Large table scans |
    | High DB load | Frequent reads |
    | Increased response time | Heavy sorting/filtering |
    | Connection exhaustion | Too many concurrent requests |
    | Storage growth | Millions of notifications |
    | Lock contention | Simultaneous writes |
    | Slow pagination | OFFSET scans |

    ---

    # Solutions to Scaling Problems

    ---

    # 1. Proper Indexing

    Indexes reduce full table scans and improve lookup speed.

    Example:

    ```sql
    CREATE INDEX idx_notifications_student_read_created
    ON notifications(student_id, is_read, created_at DESC);
    ```

    ---

    # 2. Pagination

    Instead of loading all notifications:

    ```http
    GET /api/notifications?page=1&limit=20
    ```

    Benefits:

    - Smaller payload size
    - Reduced memory usage
    - Faster response time

    ---

    # 3. Database Partitioning

    Partition notifications table by:

    - created_at
    - notification_type

    Example:

    ```text
    notifications_2026_april
    notifications_2026_may
    ```

    Benefits:

    - Faster queries
    - Easier maintenance
    - Better scalability

    ---

    # 4. Redis Caching

    Frequently accessed notifications can be cached.

    Flow:

    ```text
    Frontend
    ↓
    Redis Cache
    ↓
    PostgreSQL
    ```

    Benefits:

    - Reduced DB load
    - Faster reads
    - Improved user experience

    ---

    # 5. Read Replicas

    Use database replicas for read-heavy operations.

    Benefits:

    - Distributes read traffic
    - Prevents DB overload

    ---

    # 6. Queue-Based Architecture

    Use message queues like:

    - RabbitMQ
    - Kafka

    for bulk notification processing.

    Benefits:

    - Async processing
    - Better reliability
    - Improved scalability

    ---

    # 7. Archiving Old Notifications

    Move old notifications to archive tables.

    Benefits:

    - Smaller active dataset
    - Faster queries

    ---

    # SQL Queries Based on REST APIs

    ---

    # 1. Get Notifications

    ```sql
    SELECT *
    FROM notifications
    WHERE student_id = 1042
    ORDER BY created_at DESC
    LIMIT 10 OFFSET 0;
    ```

    ---

    # 2. Filter Notifications by Type

    ```sql
    SELECT *
    FROM notifications
    WHERE student_id = 1042
    AND notification_type = 'Placement'
    ORDER BY created_at DESC;
    ```

    ---

    # 3. Get Unread Notifications

    ```sql
    SELECT *
    FROM notifications
    WHERE student_id = 1042
    AND is_read = FALSE
    ORDER BY created_at DESC;
    ```

    ---

    # 4. Mark Notification as Read

    ```sql
    UPDATE notifications
    SET is_read = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a1b2c3';
    ```

    ---

    # 5. Get Unread Notification Count

    ```sql
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE student_id = 1042
    AND is_read = FALSE;
    ```

    ---

    # 6. Insert New Notification

    ```sql
    INSERT INTO notifications (
        id,
        student_id,
        notification_type,
        message
    )
    VALUES (
        gen_random_uuid(),
        1042,
        'Placement',
        'Amazon hiring drive'
    );
    ```

    ---

    # 7. Bulk Notification Insert

    ```sql
    INSERT INTO notifications (
        id,
        student_id,
        notification_type,
        message
    )
    VALUES
    (gen_random_uuid(), 1042, 'Placement', 'TCS drive tomorrow'),
    (gen_random_uuid(), 1043, 'Placement', 'TCS drive tomorrow'),
    (gen_random_uuid(), 1044, 'Placement', 'TCS drive tomorrow');
    ```

    ---

    # NoSQL Alternative Consideration

    MongoDB can also be used for high-volume notification systems because of:

    - Flexible schema
    - Horizontal scaling
    - High write throughput

    However, PostgreSQL is preferred because:

    - Notification data is relational
    - Strong consistency is important
    - SQL querying is beneficial

    ---

    # Logging Middleware Integration

    All DB operations must integrate with the custom logging middleware.

    The logger should capture:

    - Query execution
    - DB failures
    - Slow queries
    - Insert/update operations
    - Bulk notification processing

    Example events:

    ```text
    INFO  → Notification fetched successfully
    WARN  → Slow query detected
    ERROR → Database connection failed
    ```
---

# Stage 3 — Query Optimization and Performance Analysis

    # Existing Query

    ```sql
    SELECT *
    FROM notifications
    WHERE studentID = 1042
    AND isRead = false
    ORDER BY createdAt ASC;
    ```

    ---

    # Is This Query Accurate?

    Yes, the query is logically correct because it fetches all unread notifications for a specific student and sorts them by creation time.

    However, the query has several performance problems when the database grows to:

    - 50,000 students
    - 5,000,000 notifications

    ---

    # Why Is This Query Slow?

    ## 1. Full Table Scan

    If proper indexes are missing, the database scans the entire notifications table to find matching rows.

    For millions of records, this becomes extremely expensive.

    ---

    # 2. Sorting Cost

    ```sql
    ORDER BY createdAt ASC
    ```

    Sorting large datasets requires additional computation and memory.

    ---

    # 3. SELECT *

    Using:

    ```sql
    SELECT *
    ```

    retrieves unnecessary columns, increasing:

    - Memory usage
    - Network transfer
    - Query execution time

    ---

    # 4. Large Result Set

    The query fetches all unread notifications without pagination.

    This may return thousands of rows for a student.

    ---

    # Optimized Query

    ```sql
    SELECT id,
        notification_type,
        message,
        created_at
    FROM notifications
    WHERE student_id = 1042
    AND is_read = FALSE
    ORDER BY created_at DESC
    LIMIT 50;
    ```

    ---

    # Improvements Made

    | Improvement | Benefit |
    |---|---|
    | Selected only required columns | Reduced memory usage |
    | Added LIMIT | Smaller result set |
    | DESC sorting | Recent notifications first |
    | Better column naming | Improved consistency |

    ---

    # Recommended Index

    ```sql
    CREATE INDEX idx_notifications_student_read_created
    ON notifications(student_id, is_read, created_at DESC);
    ```

    ---

    # Why This Index Helps

    The composite index supports:

    - Filtering by student_id
    - Filtering unread notifications
    - Sorting by created_at

    This avoids:

    - Full table scans
    - Expensive sorting operations

    ---

    # Likely Computation Cost

    ## Without Index

    ```text
    O(n)
    ```

    The DB scans the entire notifications table.

    ---

    # With Composite Index

    ```text
    O(log n)
    ```

    The DB can directly locate matching rows using the index.

    This significantly improves performance.

    ---

    # Should We Add Indexes on Every Column?

    No.

    Adding indexes on every column is not an effective strategy.

    ---

    # Problems With Too Many Indexes

    | Problem | Explanation |
    |---|---|
    | Increased storage usage | Each index consumes memory |
    | Slower INSERT operations | Indexes must also be updated |
    | Slower UPDATE operations | Index maintenance overhead |
    | Slower DELETE operations | Multiple index updates required |
    | Unused indexes waste resources | Not all columns are queried frequently |

    ---

    # Best Practice for Indexing

    Indexes should only be created on:

    - Frequently filtered columns
    - JOIN columns
    - ORDER BY columns
    - Frequently searched columns

    Examples:

    ```text
    student_id
    is_read
    created_at
    notification_type
    ```

    ---

    # Query to Find Students Who Received Placement Notifications in Last 7 Days

    ```sql
    SELECT DISTINCT student_id
    FROM notifications
    WHERE notification_type = 'Placement'
    AND created_at >= NOW() - INTERVAL '7 days';
    ```

    ---

    # Why DISTINCT Is Used

    A student may receive multiple placement notifications.

    Using:

    ```sql
    DISTINCT
    ```

    ensures each student appears only once.

    ---

    # Additional Performance Improvements

    ---

    # 1. Pagination

    Instead of fetching all notifications:

    ```http
    GET /api/notifications?page=1&limit=20
    ```

    Benefits:

    - Smaller responses
    - Faster loading
    - Reduced DB load

    ---

    # 2. Redis Caching

    Frequently accessed unread notifications can be cached.

    Benefits:

    - Reduced database traffic
    - Faster response times

    ---

    # 3. Table Partitioning

    Partition notifications table based on:

    - Month
    - Year
    - Notification type

    Example:

    ```text
    notifications_2026_april
    notifications_2026_may
    ```

    Benefits:

    - Faster scans
    - Easier maintenance

    ---

    # 4. Read Replicas

    Use separate replicas for read-heavy operations.

    Benefits:

    - Improved scalability
    - Reduced load on primary DB

    ---

    # 5. Background Cleanup Jobs

    Archive old notifications periodically.

    Benefits:

    - Smaller active dataset
    - Faster queries

    ---

    # Logging Middleware Usage

    All optimized queries and DB operations should be logged using the custom logging middleware.

    Example log events:

    ```text
    INFO  → Notifications fetched successfully
    WARN  → Slow query execution detected
    ERROR → Database timeout occurred
    ```

    No inbuilt console logging should be used.
---

# Stage 4 — Performance Improvement and Scalability Strategy

        # Problem Statement

        Currently, notifications are being fetched from the database every time a student loads or refreshes the page.

        With:

        - 50,000 students
        - Millions of notifications
        - Frequent page refreshes

        the database becomes overloaded, resulting in:

        - Slow API responses
        - High DB CPU usage
        - Increased latency
        - Poor user experience

        ---

        # Recommended Solution

        A combination of the following strategies should be used to improve performance and scalability:

        1. Redis Caching
        2. WebSockets for Real-Time Updates
        3. Pagination
        4. Read Replicas
        5. Queue-Based Architecture
        6. Database Indexing
        7. CDN and Compression
        8. Lazy Loading

        ---

        # 1. Redis Caching

        ## Solution

        Use Redis to cache frequently accessed notifications.

        ---

        # Architecture

        ```text
        Frontend Client
            ↓
        Redis Cache
            ↓
        PostgreSQL Database
        ```

        ---

        # How It Works

        - Frequently requested notifications are stored in Redis.
        - Future requests are served directly from cache.
        - Database load is reduced significantly.

        ---

        # Example Flow

        ```text
        Student opens dashboard
                ↓
        Check Redis Cache
                ↓
        Cache Hit → Return Data
        Cache Miss → Fetch from DB → Store in Redis
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Faster responses | Reduced DB access |
        | Lower DB load | Fewer repeated queries |
        | Better scalability | Handles large traffic |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Very fast reads | Additional infrastructure |
        | Reduced DB pressure | Cache invalidation complexity |
        | Improved user experience | Increased memory usage |

        ---

        # 2. WebSockets for Real-Time Notifications

        ## Problem

        Currently the frontend repeatedly fetches notifications using API calls.

        This creates unnecessary traffic.

        ---

        # Solution

        Use WebSockets (Socket.IO) for real-time notification delivery.

        ---

        # How It Works

        ```text
        Backend sends notification instantly
                ↓
        Student receives update immediately
                ↓
        No repeated polling required
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Instant updates | Real-time communication |
        | Reduced API calls | Lower server load |
        | Better UX | Faster notification delivery |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Real-time delivery | Persistent connections required |
        | Lower polling overhead | Slightly more complex setup |

        ---

        # 3. Pagination

        ## Problem

        Fetching all notifications at once increases:

        - Response size
        - Memory usage
        - Query time

        ---

        # Solution

        Use pagination.

        Example:

        ```http
        GET /api/notifications?page=1&limit=20
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Smaller responses | Faster loading |
        | Reduced DB workload | Efficient queries |
        | Improved frontend rendering | Less memory usage |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Better performance | Multiple API calls required |

        ---

        # 4. Read Replicas

        ## Solution

        Use read replicas for read-heavy operations.

        ---

        # Architecture

        ```text
                        Primary DB
                    /         \
            Read Replica 1   Read Replica 2
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Distributes traffic | Prevents DB overload |
        | Better scalability | Improved read performance |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Scales reads efficiently | Replication lag possible |

        ---

        # 5. Queue-Based Architecture

        ## Problem

        Bulk notifications create sudden spikes in DB and email traffic.

        ---

        # Solution

        Use message queues like:

        - RabbitMQ
        - Kafka

        ---

        # Architecture

        ```text
        Notification Request
                ↓
        Message Queue
                ↓
        Worker Services
                ↓
        DB Save + Push Notification + Email
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Async processing | Faster API response |
        | Better reliability | Retry support |
        | Handles spikes | Improved scalability |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Reliable processing | More infrastructure complexity |

        ---

        # 6. Database Indexing

        ## Solution

        Use indexes on frequently queried columns.

        Example:

        ```sql
        CREATE INDEX idx_notifications_student_read_created
        ON notifications(student_id, is_read, created_at DESC);
        ```

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Faster queries | Reduced scan time |
        | Efficient sorting | Improved response time |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Faster reads | Slower writes |
        | Better filtering | Additional storage usage |

        ---

        # 7. Compression and CDN

        ## Compression

        Use:

        - Gzip
        - Brotli

        to reduce response payload size.

        ---

        # CDN

        Static frontend assets can be served using CDN.

        Benefits:

        - Faster loading
        - Reduced server bandwidth

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Faster delivery | CDN configuration required |

        ---

        # 8. Lazy Loading and Infinite Scroll

        Instead of loading all notifications at once:

        - Load notifications gradually
        - Fetch more on scroll

        ---

        # Benefits

        | Benefit | Description |
        |---|---|
        | Improved frontend performance | Reduced initial load |
        | Better user experience | Faster rendering |

        ---

        # Tradeoffs

        | Advantage | Disadvantage |
        |---|---|
        | Efficient rendering | Slightly complex frontend logic |

        ---

        # Recommended Final Architecture

        ```text
        Frontend Client
            ↓
        Load Balancer
            ↓
        Application Servers
            ↓
        Redis Cache
            ↓
        PostgreSQL Primary DB
            ↓
        Read Replicas

        Real-Time Notifications:
        Socket.IO/WebSockets

        Async Processing:
        RabbitMQ/Kafka + Worker Services
        ```

        ---

        # Overall Performance Improvements

        | Strategy | Main Benefit |
        |---|---|
        | Redis | Reduced DB load |
        | WebSockets | Real-time updates |
        | Pagination | Smaller responses |
        | Read Replicas | Scalable reads |
        | Queues | Reliable async processing |
        | Indexes | Faster queries |
        | Compression | Reduced payload size |

        ---

        # Logging Middleware Integration

        The custom logging middleware should monitor:

        - Slow API requests
        - Cache hits/misses
        - DB query execution
        - Queue failures
        - WebSocket delivery errors
        - Read replica failures

        Example logs:

        ```text
        INFO  → Cache hit for student notifications
        WARN  → Slow query detected
        ERROR → Redis connection failed
        ERROR → Queue processing failed
        ```

        No inbuilt console logging should be used.
    ---

# Stage 5 — Reliable and Scalable Bulk Notification Architecture

    # Existing Pseudocode

    ```python
    function notify_all(student_ids: array, message: string):

        for student_id in student_ids:

            send_email(student_id, message)

            save_to_db(student_id, message)

            push_to_app(student_id, message)
    ```

    ---

    # Problems in the Existing Implementation

    The current implementation has several scalability and reliability issues.

    ---

    # 1. Sequential Processing

    The notifications are processed one student at a time.

    For 50,000 students:

    - Processing becomes extremely slow
    - API response time increases significantly

    ---

    # 2. No Retry Mechanism

    If:

    ```text
    send_email()
    ```

    fails for some students, those notifications are permanently lost.

    This causes inconsistency.

    ---

    # 3. No Fault Tolerance

    A single failure may interrupt the entire notification process.

    Example:

    ```text
    Email service crashes midway
    ```

    Remaining students may never receive notifications.

    ---

    # 4. Tight Coupling

    The following operations are tightly coupled:

    - Database save
    - Email sending
    - Push notification

    If one fails, the entire flow becomes unstable.

    ---

    # 5. No Parallel Processing

    All tasks execute synchronously.

    This wastes system resources and reduces throughput.

    ---

    # 6. No Queueing System

    Sudden spikes such as:

    ```text
    Notify All → 50,000 students
    ```

    can overload:

    - Application servers
    - Database
    - Email service

    ---

    # 7. No Monitoring or Recovery

    Failed operations are not tracked properly.

    No retry queue or dead-letter queue exists.

    ---

    # What Happens if Email Fails for 200 Students?

    If:

    ```text
    send_email()
    ```

    fails midway for 200 students:

    - Those students may not receive emails
    - Database entries may already exist
    - In-app notifications may already be sent
    - System becomes inconsistent

    Without retries or failure tracking, recovery becomes difficult.

    ---

    # Recommended Solution

    Use an asynchronous event-driven architecture with:

    1. Message Queue
    2. Worker Services
    3. Retry Mechanism
    4. Dead Letter Queue (DLQ)
    5. Batch Processing
    6. Independent Services

    ---

    # Recommended Technologies

    | Component | Suggested Technology |
    |---|---|
    | Queue System | RabbitMQ / Kafka |
    | Cache | Redis |
    | Real-time Push | Socket.IO |
    | Database | PostgreSQL |
    | Workers | Background worker services |

    ---

    # Improved Architecture

    ```text
    HR/Admin Clicks "Notify All"
                ↓
    Notification Service
                ↓
    Save Notification Metadata
                ↓
    Publish Jobs to Queue
                ↓
    -----------------------------------
    |               |                |
    Email Worker   Push Worker   DB Worker
    -----------------------------------
                ↓
    Retry Queue / Dead Letter Queue
    ```

    ---

    # Why Queue-Based Architecture?

    Queues help:

    - Handle traffic spikes
    - Process tasks asynchronously
    - Improve reliability
    - Enable retries
    - Prevent server overload

    ---

    # Should Saving to DB and Sending Email Happen Together?

    No.

    These operations should not happen inside a single synchronous transaction.

    ---

    # Why?

    Email delivery depends on external services which may fail.

    If email fails:

    - Database transaction should not rollback
    - Notifications should still exist in DB

    Therefore:

    - DB write should succeed independently
    - Email sending should happen asynchronously

    ---

    # Recommended Approach

    ## Step 1

    Save notification metadata to DB.

    ---

    # Step 2

    Publish notification jobs to queue.

    ---

    # Step 3

    Worker services process jobs independently.

    ---

    # Benefits

    | Benefit | Description |
    |---|---|
    | Reliability | Failures can be retried |
    | Scalability | Workers can scale horizontally |
    | Faster API response | Async processing |
    | Better fault isolation | Services fail independently |

    ---

    # Retry Mechanism

    If email sending fails:

    - Retry automatically
    - Exponential backoff can be used

    Example:

    ```text
    Retry after:
    1 sec → 5 sec → 30 sec
    ```

    ---

    # Dead Letter Queue (DLQ)

    After maximum retries:

    - Failed jobs move to DLQ
    - Manual inspection becomes possible

    ---

    # Batch Processing

    Instead of processing 50,000 students individually:

    - Split students into smaller batches

    Example:

    ```text
    1000 students per batch
    ```

    Benefits:

    - Better memory usage
    - Improved throughput
    - Easier retry handling

    ---

    # Revised Scalable Pseudocode

    ## Notification Service

    ```python
    function notify_all(student_ids, message, notification_type):

        notification_batch_id = generate_batch_id()

        save_batch_metadata(
            notification_batch_id,
            message,
            notification_type
        )

        batches = chunk(student_ids, 1000)

        for batch in batches:

            publish_to_queue({
                "batch_id": notification_batch_id,
                "student_ids": batch,
                "message": message,
                "type": notification_type
            })

        return "Notification jobs queued successfully"
    ```

    ---

    # Worker Service

    ```python
    function notification_worker(job):

        for student_id in job.student_ids:

            try:

                save_notification_to_db(
                    student_id,
                    job.message,
                    job.type
                )

                send_email(
                    student_id,
                    job.message
                )

                push_realtime_notification(
                    student_id,
                    job.message
                )

                log_success(student_id)

            except Exception as error:

                retry_job(job)

                log_error(error)
    ```

    ---

    # Additional Optimizations

    ---

    # 1. Parallel Workers

    Multiple worker instances can process jobs simultaneously.

    Benefits:

    - Faster processing
    - Horizontal scalability

    ---

    # 2. Redis Cache

    Unread notifications can be cached for faster access.

    ---

    # 3. WebSockets

    Use Socket.IO for real-time in-app notifications.

    ---

    # 4. Monitoring and Metrics

    Track:

    - Failed jobs
    - Queue size
    - Email success rate
    - Worker health

    Tools:

    - Prometheus
    - Grafana

    ---

    # Computation and Performance Benefits

    | Strategy | Benefit |
    |---|---|
    | Queues | Async scalable processing |
    | Batching | Reduced overhead |
    | Workers | Parallel execution |
    | Retries | Improved reliability |
    | DLQ | Failure recovery |
    | WebSockets | Real-time delivery |

    ---

    # Logging Middleware Integration

    The custom logging middleware should log:

    - Queue publish events
    - Worker processing status
    - Email failures
    - Retry attempts
    - Push notification failures
    - Dead letter queue events

    Example logs:

    ```text
    INFO  → Batch notification queued
    INFO  → Email sent successfully
    WARN  → Retry attempt initiated
    ERROR → Email delivery failed
    ERROR → Message moved to DLQ
    ```

    No inbuilt console logging should be used.