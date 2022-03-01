# Project Design:
    # My database is inplemented as an object db = {[key1] : [value1], [key2] : [value2], ... }.
    # Functions will directly change or delete elements in db (see ./api/Ledis-api-docs.txt for functions descriptions).
    # Expiration is handled by the function checkIfExpired(). All other functions that handles command calls this function. 
    # checkIfExpired() will delete the keys involved in the function that calls it if current time has exceeded the keys' expiration.
    # So, instead of having to constantly keep track of time and delete keys that are expired, we can delete those keys whenever functions access their values.
    # Snapshots: save() will save the current state of the database to a JSON string, which can be accessed by restore() to restore the database to the previously recorded states.
