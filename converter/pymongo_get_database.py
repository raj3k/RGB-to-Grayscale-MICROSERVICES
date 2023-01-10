from pymongo import MongoClient


def get_database():
    
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient("mongo", 27017)
   # client = MongoClient("localhost", 27017)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
   # Get the database
   dbname = get_database()