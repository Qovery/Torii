import json
import sys
from time import sleep

if __name__ == '__main__':
    arg_json = sys.argv[1]

    json.loads(arg_json)
    # wait for 10 seconds
    sleep(10)

    print('OK')
