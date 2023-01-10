import pika
import sys
import os
import gridfs
import time
from pymongo_get_database import get_database
from convert import to_grayscale


def main():
    client = get_database()
    print("connected to Mongo")

    db_preconverted = client.preconverted
    db_converted = client.converted

    # GridFs
    fs_preconverted = gridfs.GridFS(db_preconverted)
    fs_converted = gridfs.GridFS(db_converted)

    #     rabbitmq connection
    while True:
        try:
            # connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost", port=5672))
            connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
            break
        except Exception as err:
            print("Error: ", err)
            time.sleep(3)
    
    channel = connection.channel()
    channel.queue_declare(queue='preconverted', durable=True)
    channel.queue_declare(queue="converted", durable=True)

    def callback(ch, method, properties, body):
        err = to_grayscale.convert_to_grayscale(body, fs_preconverted, fs_converted, ch)
        if err:
            ch.basic_nack(delivery_tag=method.delivery_tag)
        else:
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
        

    channel.basic_consume(
        queue="preconverted", on_message_callback=callback
    )

    print("Waiting for messages. To exit press CTRL+C")

    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(os.EX_OK)