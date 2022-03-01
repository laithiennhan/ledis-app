# ledis-app
# Ledis is a simple database application that is modeled after Redis.
# It has similar but fewer commands than Ledis.


# Data Structures:
  # 1. String: 
    # String is the most basic data structure in Ledis. Strings are used to represent keys, values, set keys.
  # 2. Set:
    # A set has a key value and then a list of other values that are assigned to the key.

# Commands:
  # 1. String:
    # SET {key} {value}: set a string {value} to {key}, always overwriting the key.
    # GET {key}: returning the value stored at {key}.
  # 2. Sets:
    # SADD {key} {value1} {value2} {value3}... : add values to set stored at {key}
    # SREM {key} {value1} {value2} {value3}... : remove specified values stored at {key}
    # SMEMBERS {key}: list all members of set stored at {key}
    # SINTER {key1} {key2} {key3} ...: return array of intersection among all sets stored in specified keys.
  # 3. Data Expiration:
    # KEYS: List all available keys.
    # DEL {key}: delete {key}
    # EXPIRE {key} {time}: set a timeout of {time} seconds on this key. Return number of seconds if timeout is set.
    # TTL {key}: query the timeout of {key}
  # 4. Snapshot:
    # SAVE: save current state of the database in a snapshot (JSON file).
    # RESTORE: restore from the last snapshot.
    
# Packages and Modules:
    # ReactJS: used to build user interface.
    # xterm: used to build a terminal to get input and return output.
    # ledisAPI: self-made API built to handle back-end side of the program. Containing functions to handle inputs, changing the database and returning outputs. 
