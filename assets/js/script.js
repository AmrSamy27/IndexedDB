const version = 1;
const dbName = 'booksDatabase';
let db ;
let bookData = {};
let objectStore;
if('indexedDB' in window){
    let request = window.indexedDB.open(dbName,version);
     let db;
    request.onsuccess = (ev)=>{
        console.log(ev)
        db = request.result;
        console.log(bookData);
        
            // bookObjectStore.index('title').add(bookData.title);
        // objectStore.transaction.oncomplete = function(event) {
        //     // Store values in the newly created objectStore.
            
        //       bookObjectStore.add(bookData);
            
        //   };
    }

    request.onupgradeneeded= (ev)=>{

           let db = event.target.result;
           console.log(db)

            objectStore = db.createObjectStore("books", { keyPath: "id",autoIncrement:true });
    
      // Create an index to search customers by name. We may have duplicates
      // so we can't use a unique index.
      objectStore.createIndex("title", "title", { unique: true });
    
      // Create an index to search customers by email. We want to ensure that
      // no two customers have the same email, so use a unique index.
      objectStore.createIndex("year", "year", { unique: false });
        
        

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
 
    }
    request.onerror = (ev)=>{
        console.log(ev);
    }
    document.querySelector('#addButton').addEventListener('click',function(){
    let title = document.querySelector('#bookTitle').value;
    let year = document.querySelector('#bookYear').value;
    let sn = document.querySelector('#bookSn').value;
    let bookObjectStore = db.transaction('books', "readwrite").objectStore("books");
        bookData = {title:title,year:year,sn:sn};
        console.log(title);
        bookObjectStore.add(bookData);
})
document.querySelector('#deleteButton').addEventListener('click',function(){
    let id = document.querySelector('#idToDelete').value;
    
    let sn = document.querySelector('#snToDelete').value;

    let bookObjectStore = db.transaction('books', "readwrite").objectStore("books");
   let request = bookObjectStore.openCursor();
   let checkSn;
   console.log(sn);
   request.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            if(sn == cursor.value.sn){
                console.log(sn);
                checkSn = true;
                id = cursor.primaryKey;
                
            }else{
                cursor.continue();

            }
        }
        if(checkSn){
            bookObjectStore.delete(Number(id));

        }else{
            bookObjectStore.delete(Number(id));

        }
      }
    
})
document.querySelector('#searchListButton').addEventListener('click',function(){
    let bookObjectStore = db.transaction('books', "readwrite").objectStore("books");
        console.log(bookObjectStore);
        var request = bookObjectStore.openCursor();
        document.querySelector('#bookViewer').innerHTML= '';
        request.onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor) {
            document.querySelector('#bookViewer').innerHTML+=`key: ${cursor.primaryKey} , values { title :${cursor.value.title} ,year:${cursor.value.year}`;
            cursor.continue();
          }
        }
})
document.querySelector('#clearStoreButton').addEventListener('click',function(){
    
    let bookObjectStore = db.transaction('books', "readwrite").objectStore("books");

        bookObjectStore.clear();
})
}

