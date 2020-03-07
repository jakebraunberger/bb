import sqlite3
import time
import numpy as np

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
	database = 'modbusReg.db'
	conn = create_connection(database)
	int_id = 204

	# create 1000 new data points
	for i in np.arange(1000):
		with conn:
			time.sleep(6)
			int_t = int(time.time())
			datum = int(np.random.uniform(low=1.0, high=10.0))
			s = (int_id, int_t, datum)
			create_reg10(conn, s)
			print(str(datum))
			int_id += 1

if __name__ == '__main__':
	main()
