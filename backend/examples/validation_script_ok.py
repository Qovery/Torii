import json
import os
import sys
from time import sleep

if __name__ == '__main__':
    arg_json = sys.argv[1]

    j = json.loads(arg_json)

    # wait for 5 seconds
    for i in range(5):
        print('Validation script waiting...')
        sleep(1)

    os.environ["TORII_JSON_OUTPUT"] = json.dumps({"status": "OK", "message": "Validation script OK"})
