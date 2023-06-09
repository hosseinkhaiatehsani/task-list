// Open the IndexedDB database and create object stores
export function openDatabase(databaseName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
  
      request.onupgradeneeded = function(event) {
        // console.log(event.target)
        const db = event.target.result;
        // if (!db.objectStoreNames.contains('myStore')) {
        const objectStore = db.createObjectStore('myStore', { keyPath: 'id' });
        // }
      };
  
      request.onerror = function(event) {
        reject(new Error('IndexedDB error: ' + event.target.error));
      };
  
      request.onsuccess = function(event) {
        const db = event.target.result;
        resolve(db);
      };
    });
  }
  
  // Store data in IndexedDB
  export function storeData(databaseName, data) {
    return new Promise((resolve, reject) => {
      openDatabase(databaseName)
        .then(db => {
          var transaction = db.transaction(['myStore'], 'readwrite');
          var store = transaction.objectStore('myStore');
          const promises = [];
  
          data.forEach(item => {
            const request = store.put(item);
            const promise = new Promise((res, rej) => {
              request.onsuccess = function(event) {
                res();
              };
  
              request.onerror = function(event) {
                rej();
              };
            });
            promises.push(promise);
          });
  
          Promise.all(promises)
            .then(() => {
              transaction.oncomplete = function() {
                db.close();
                resolve('Data stored successfully');
              };
            })
            .catch(error => {
              reject('Failed to store data');
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

// Retrieve data from IndexedDB by key
export function retrieveData(db, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['myStore'], 'readonly');
    const objectStore = transaction.objectStore('myStore');
    const getRequest = objectStore.get(key);

    getRequest.onsuccess = function(event) {
      const data = event.target.result;
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Data not found'));
      }
    };

    getRequest.onerror = function(event) {
      reject(new Error('Error retrieving data from IndexedDB: ' + event.target.error));
    };
  });
}

// Retrieve all data from IndexedDB
export function retrieveAllData(databaseName) {
    return new Promise(async (resolve, reject) => {
        let database = await checkDataBase();
        if(database.length == 0){
          await openDatabase(databaseName);
        }

        const request = indexedDB.open(databaseName, 1);

        request.onsuccess = function(event) {
            // console.log(request)
            try{
                const db = event.target.result;

                // console.log(db)
                if(db.objectStoreNames.length == 0){
                  db.close();
                  resolve([]);
                }
                const transaction = db.transaction('myStore', 'readonly');
                const objectStore = transaction.objectStore('myStore');
                const data = [];
                objectStore.openCursor().onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    } else {
                        db.close();
                        resolve(data);
                    }
                };
                transaction.oncomplete = function() {
                    db.close();
                };
            }catch(err){
                resolve([])
            }
        };
        request.onerror = function(event) {
            // reject('Failed to open the database');
            resolve([]);
        };
    });
}

// Update data in IndexedDB
export function updateData(db, updatedData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['myStore'], 'readwrite');
    const objectStore = transaction.objectStore('myStore');
    const updateRequest = objectStore.put(updatedData);

    updateRequest.onsuccess = function(event) {
      resolve();
    };

    updateRequest.onerror = function(event) {
      reject(new Error('Error updating data in IndexedDB: ' + event.target.error));
    };
  });
}

// Delete data from IndexedDB
export function deleteData(databaseName, key) {
  return new Promise((resolve, reject) => {
    openDatabase(databaseName)
    .then(db => {
      const transaction = db.transaction(['myStore'], 'readwrite');
      const objectStore = transaction.objectStore('myStore');
      const deleteRequest = objectStore.delete(key);
  
      deleteRequest.onsuccess = function(event) {
        db.close();
        resolve();
      };
  
      deleteRequest.onerror = function(event) {
        db.close();
        reject(new Error('Error deleting data from IndexedDB: ' + event.target.error));
      };
    }).catch(error => {
      reject(new Error('Error deleting data from IndexedDB: ' + error));
    })
  });
}


export function checkDataBase(){
  return new Promise(resolve => {
    try{

      let db = indexedDB.databases();
      resolve(db)
    }catch(err){
      resolve([])
    }
    
  })
}