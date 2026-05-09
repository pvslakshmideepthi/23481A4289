import requests
import heapq
from datetime import datetime

# ==================================================
# CONFIGURATION
 

API_URL = "http://4.224.186.213/evaluation-service/notifications"

# Paste your FULL access token here
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMzQ4MWE0Mjg5QGdlY2d1ZGxhdmFsbGVydW1pYy5pbiIsImV4cCI6MTc3ODMwOTk0MSwiaWF0IjoxNzc4MzA5MDQxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjIyNGFjNzUtZDdjNi00NGFlLTlkZjMtOTRjNTA4OTg2YzgzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicG9uZHVyaSB2ZW5rYXRhIHNhaSBsYWtzaG1pIGRlZXB0aGkiLCJzdWIiOiIyMzMwODg2Yi05N2FlLTRkMWYtOWJjYy0zMWZiMWM3YzNhZDMifSwiZW1haWwiOiIyMzQ4MWE0Mjg5QGdlY2d1ZGxhdmFsbGVydW1pYy5pbiIsIm5hbWUiOiJwb25kdXJpIHZlbmthdGEgc2FpIGxha3NobWkgZGVlcHRoaSIsInJvbGxObyI6IjIzNDgxYTQyODkiLCJhY2Nlc3NDb2RlIjoiZUpkQ3VDIiwiY2xpZW50SUQiOiIyMzMwODg2Yi05N2FlLTRkMWYtOWJjYy0zMWZiMWM3YzNhZDMiLCJjbGllbnRTZWNyZXQiOiJ0UlNtSkRmR0pIY1ZmZGd3In0.mkGFIcEMCRgRYDjpF_HJwSLD5RaWpPDjXXDBtdqQ_Gc"

TOP_N = 10

# ==================================================
# PRIORITY WEIGHTS
# ==================================================

TYPE_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

# ==================================================
# FETCH NOTIFICATIONS
# ==================================================

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

try:

    response = requests.get(API_URL, headers=headers)

    print("\nSTATUS CODE:", response.status_code)

    print("\nRAW RESPONSE:")
    print(response.text)

    # Convert response to JSON
    data = response.json()

except Exception as error:

    print("\nFAILED TO FETCH DATA")
    print(error)
    exit()

# ==================================================
# EXTRACT NOTIFICATIONS
# ==================================================

notifications = data.get("notifications", [])

print("\nTOTAL NOTIFICATIONS:", len(notifications))

# ==================================================
# CHECK EMPTY DATA
# ==================================================

if len(notifications) == 0:

    print("\nNo notifications found.")
    exit()

# ==================================================
# MIN HEAP FOR TOP NOTIFICATIONS
# ==================================================

heap = []

current_time = datetime.now()

# ==================================================
# PROCESS NOTIFICATIONS
# ==================================================

for notification in notifications:

    try:

        notification_type = notification["Type"]

        timestamp = datetime.strptime(
            notification["Timestamp"],
            "%Y-%m-%d %H:%M:%S"
        )

        # ------------------------------------------
        # RECENCY SCORE
        # ------------------------------------------

        seconds_old = (
            current_time - timestamp
        ).total_seconds()

        recency_score = max(
            1,
            1000000 / (seconds_old + 1)
        )

        # ------------------------------------------
        # FINAL PRIORITY SCORE
        # ------------------------------------------

        priority_score = (
            TYPE_WEIGHTS.get(notification_type, 0) * 1000
            + recency_score
        )

        item = (
            priority_score,
            notification
        )

        # ------------------------------------------
        # MAINTAIN TOP N USING MIN HEAP
        # ------------------------------------------

        if len(heap) < TOP_N:

            heapq.heappush(heap, item)

        else:

            if priority_score > heap[0][0]:

                heapq.heappop(heap)

                heapq.heappush(heap, item)

    except Exception as error:

        print("\nERROR PROCESSING NOTIFICATION")
        print(error)

# ==================================================
# SORT FINAL RESULTS
# ==================================================

top_notifications = sorted(
    heap,
    key=lambda x: x[0],
    reverse=True
)

# ==================================================
# DISPLAY RESULTS
# ==================================================

print("\n========== TOP 10 PRIORITY NOTIFICATIONS ==========\n")

for rank, item in enumerate(top_notifications, start=1):

    score = item[0]

    notification = item[1]

    print(f"Rank #{rank}")

    print(f"ID         : {notification['ID']}")

    print(f"Type       : {notification['Type']}")

    print(f"Message    : {notification['Message']}")

    print(f"Timestamp  : {notification['Timestamp']}")

    print(f"Score      : {round(score, 2)}")

    print("-" * 60)

print("\nTOP 10 PRIORITY NOTIFICATIONS GENERATED SUCCESSFULLY")