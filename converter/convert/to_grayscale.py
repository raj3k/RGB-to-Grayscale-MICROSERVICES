import pika
import json
import tempfile
import os
from PIL import Image
from bson.objectid import ObjectId

def convert_to_grayscale(message, fs_preconverted, fs_converted, channel):
    message = json.loads(message)
    print(message)
    # empty temporary file
    tf = tempfile.NamedTemporaryFile()
    # preconverted image to file
    image_pre = fs_preconverted.get(ObjectId(message["fid"]))
    # add image contents to empty file
    tf.write(image_pre.read())

    with Image.open(tf.name) as im:
        gray_img = im.convert("L")
        tf.close()
        tf_path = tempfile.gettempdir() + f"/{message['fid']}.jpg"
        gray_img.save(tf_path)

    with open(tf_path, "rb") as f:
        data = f.read()
        fid = fs_converted.put(data)
        os.remove(tf_path)
        message["converted_fid"] = str(fid)

    print(message)

    try:
        channel.basic_publish(
            exchange="",
            routing_key="converted",
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
            ),
        )
    except Exception as err:
        fs_converted.delete(fid)
        return "failed to publish message"