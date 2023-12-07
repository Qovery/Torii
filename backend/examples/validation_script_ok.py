import json
import sys
from time import sleep

if __name__ == '__main__':
    arg_json = sys.argv[1]

    json.loads(arg_json)
    # wait for 5 seconds
    sleep(5)

    print('OK')
