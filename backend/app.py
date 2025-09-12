from flask import Flask, request, jsonify
import mysql.connector
from datetime import date, timedelta, datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    "host": os.getenv("DB_HOST" ,"sql.freedb.tech"),
    "user": os.getenv("DB_USER" , "freedb_habitdb"),
    "password": os.getenv("DB_PASSWORD" , ""),
    "database": os.getenv("DB_NAME" , "freedb_abhiDev"),
    "port": int(os.getenv("DB_PORT", "3306")),
}


def get_db_connection():
    return mysql.connector.connect(**db_config)


@app.route('/habits', methods=['POST'])
def add_habit():
    data = request.get_json()
    habit_name = data.get("name", "").strip()
    user_id = 1  # Default user

    if not habit_name or len(habit_name) < 2:
        return jsonify({"error": "Habit name must be at least 2 characters"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if habit already exists
    cursor.execute(
        "SELECT id FROM habits WHERE user_id = %s AND LOWER(name) = LOWER(%s)",
        (user_id, habit_name)
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Habit already exists"}), 409

    # Insert new habit
    cursor.execute(
        "INSERT INTO habits (user_id, name, created_at) VALUES (%s, %s, %s)",
        (user_id, habit_name, datetime.now())
    )
    habit_id = cursor.lastrowid
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Habit added successfully!",
        "habit_id": habit_id,
        "name": habit_name
    }), 201


@app.route('/habits', methods=['GET'])
def get_habits():
    user_id = 1  # Default user

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT h.*, COUNT(hl.id) as total_completed,
               MAX(hl.date) as last_completed
        FROM habits h 
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.status = 1
        WHERE h.user_id = %s 
        GROUP BY h.id
        ORDER BY h.created_at DESC
    """, (user_id,))

    habits = cursor.fetchall()

    # Convert datetime objects to strings
    for habit in habits:
        if habit['created_at']:
            habit['created_at'] = habit['created_at'].isoformat()
        if habit['last_completed']:
            habit['last_completed'] = habit['last_completed'].isoformat()

    cursor.close()
    conn.close()

    return jsonify(habits), 200


@app.route('/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Delete habit logs first
    cursor.execute("DELETE FROM habit_logs WHERE habit_id = %s", (habit_id,))

    # Delete habit
    cursor.execute("DELETE FROM habits WHERE id = %s", (habit_id,))

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({"error": "Habit not found"}), 404

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Habit deleted successfully"}), 200


@app.route('/habits/<int:habit_id>/done', methods=['POST'])
def mark_done(habit_id):
    today = date.today()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if already marked today
    cursor.execute(
        "SELECT id FROM habit_logs WHERE habit_id = %s AND date = %s",
        (habit_id, today)
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Already marked as done today!"}), 200

    # Mark as done
    cursor.execute(
        "INSERT INTO habit_logs (habit_id, date, status, created_at) VALUES (%s, %s, %s, %s)",
        (habit_id, today, 1, datetime.now())
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Habit marked as done for today!"}), 201


@app.route('/habits/<int:habit_id>/streak', methods=['GET'])
def get_streak(habit_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Verify habit exists
    cursor.execute("SELECT name FROM habits WHERE id = %s", (habit_id,))
    habit = cursor.fetchone()
    if not habit:
        cursor.close()
        conn.close()
        return jsonify({"error": "Habit not found"}), 404

    # Get all completion dates
    cursor.execute(
        "SELECT date FROM habit_logs WHERE habit_id = %s AND status = 1 ORDER BY date DESC",
        (habit_id,)
    )
    logs = cursor.fetchall()

    cursor.close()
    conn.close()

    if not logs:
        return jsonify({
            "current_streak": 0,
            "longest_streak": 0,
            "total_completed": 0
        })

    # Calculate current streak
    current_streak = 0
    expected_date = date.today()

    for log in logs:
        log_date = log['date']
        if log_date == expected_date:
            current_streak += 1
            expected_date -= timedelta(days=1)
        else:
            break

    # Calculate longest streak
    longest_streak = 0
    temp_streak = 0
    all_dates = [log['date'] for log in logs]
    all_dates.sort()

    if all_dates:
        temp_streak = 1
        for i in range(1, len(all_dates)):
            if all_dates[i] - all_dates[i-1] == timedelta(days=1):
                temp_streak += 1
            else:
                longest_streak = max(longest_streak, temp_streak)
                temp_streak = 1
        longest_streak = max(longest_streak, temp_streak)

    return jsonify({
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_completed": len(logs)
    })


@app.route('/habits/<int:habit_id>/history', methods=['GET'])
def get_habit_history(habit_id):
    days = request.args.get('days', 30, type=int)

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Verify habit exists
    cursor.execute("SELECT name FROM habits WHERE id = %s", (habit_id,))
    habit = cursor.fetchone()
    if not habit:
        cursor.close()
        conn.close()
        return jsonify({"error": "Habit not found"}), 404

    # Get history for specified days
    start_date = date.today() - timedelta(days=days-1)
    cursor.execute(
        "SELECT date, status FROM habit_logs WHERE habit_id = %s AND date >= %s ORDER BY date DESC",
        (habit_id, start_date)
    )
    logs = cursor.fetchall()

    cursor.close()
    conn.close()

    # Convert to dict for easy lookup
    log_dict = {log['date'].isoformat(): log['status'] for log in logs}

    # Generate complete history
    history = []
    current_date = date.today()
    for i in range(days):
        date_str = current_date.isoformat()
        history.append({
            "date": date_str,
            "completed": log_dict.get(date_str, 0) == 1
        })
        current_date -= timedelta(days=1)

    return jsonify({
        "habit_name": habit['name'],
        "history": history
    })


@app.route('/stats', methods=['GET'])
def get_stats():
    user_id = 1  # Default user

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Total habits
    cursor.execute(
        "SELECT COUNT(*) as total_habits FROM habits WHERE user_id = %s", (user_id,))
    total_habits = cursor.fetchone()['total_habits']

    # Habits completed today
    today = date.today()
    cursor.execute("""
        SELECT COUNT(DISTINCT hl.habit_id) as completed_today 
        FROM habit_logs hl 
        JOIN habits h ON hl.habit_id = h.id 
        WHERE h.user_id = %s AND hl.date = %s AND hl.status = 1
    """, (user_id, today))
    completed_today = cursor.fetchone()['completed_today']

    # Total completions
    cursor.execute("""
        SELECT COUNT(*) as total_completions 
        FROM habit_logs hl 
        JOIN habits h ON hl.habit_id = h.id 
        WHERE h.user_id = %s AND hl.status = 1
    """, (user_id,))
    total_completions = cursor.fetchone()['total_completions']

    cursor.close()
    conn.close()

    return jsonify({
        "total_habits": total_habits,
        "completed_today": completed_today,
        "remaining_today": total_habits - completed_today,
        "total_completions": total_completions,
        "completion_rate_today": round((completed_today / total_habits * 100) if total_habits > 0 else 0, 1)
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
