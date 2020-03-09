import sqlite3
import time
import numpy as np
import csv

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
 
    return conn

def read_csv_values(csv_file, conn):
    f_in = open(csv_file, 'r')
    cr = csv.reader(f_in)
    i = 0

    for row in cr:
        if i == 0:
            pass
        else:
            sql = ''' INSERT INTO display VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) '''
            cur = conn.cursor()
            row = np.array(row, dtype=int)
            row = row.tolist()
            print(row)
            cur.execute(sql, row)
            print (cur.lastrowid)
            conn.commit()
            time.sleep(3)
        i += 1

def create_reg10(conn, reg10):
    """
    Create a new project into the projects table
    :param conn:
    :param project:
    :return: project id
    """
    sql = ''' INSERT INTO reg(ID,TIME,REG10)
              VALUES(?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, reg10)
    return cur.lastrowid

def main():
    database = 'display.db'
    conn = create_connection(database)
    int_id = 204

    # create 1000 new data points
    csv_file = 'values_to_insert_into_display_db.csv'
    read_csv_values(csv_file, conn)

if __name__ == '__main__':
    main()
