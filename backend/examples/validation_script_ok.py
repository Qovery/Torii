import json
import sys

if __name__ == '__main__':
    arg_json = sys.argv[1]

    json.loads(arg_json)

    print('OK')
