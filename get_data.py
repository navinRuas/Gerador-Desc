from flask import Flask, jsonify
import os
import json
import mysql.connector

app = Flask(__name__)

@app.route('/get_data')
def get_data():
    conn = None
    try:
        # Get the path to the config.json file
        config_file = os.path.join(os.path.dirname(__file__), "sec\\config.json")

        # Read the contents of the config.json file
        with open(config_file, 'r') as f:
            config = json.load(f)

        # Get database credentials from the config dictionary
        db_host = config["dbHost"]
        db_port = config["dbPort"]
        db_username = config["dbUsername"]
        db_password = config["dbPassword"]
        db_name = config["dbName"]

        # Create connection
        conn = mysql.connector.connect(
            host=db_host,
            port=db_port,
            user=db_username,
            password=db_password,
            database=db_name
        )

        # Check connection
        if conn.is_connected():
            # Query data from the De-Para table
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM eAud.`De-Para`")
            rows = cursor.fetchall()

            # Check if rows is None
            if rows is None:
                return "Error: cursor.fetchall() returned None"
            else:
                # Encode the rows as a JSON object and return it
                print(jsonify(rows))
                return jsonify(rows)
                
        else:
            return "Connection failed"

    except Exception as e:
        # Print any exceptions that occur
        return str(e)

    finally:
        # Close the connection if it was opened
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    app.run()