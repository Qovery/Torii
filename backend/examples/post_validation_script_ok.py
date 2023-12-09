import json
import os
import sys
from time import sleep

if __name__ == '__main__':
    arg_json = sys.argv[1]

    json.loads(arg_json)

    # wait for 5 seconds
    for i in range(5):
        print('Validation script waiting...')
        sleep(1)

    # set TORII_OUTPUT to the output of the validation script
    # TORII_OUTPUT is used by the backend to pass the output of the validation to the next step and to the frontend
    os.environ['TORII_JSON_OUTPUT'] = '{"status": "OK", "message": "Post validation script OK"}'

    print('OK')
