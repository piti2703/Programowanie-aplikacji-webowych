import firebase from "firebase/app";
import "firebase/firestore";
import { NoteType } from './types';

interface NoteUpdateInterface {
  title?: string,
  body?: string,
  color?: string,
  isPinned?: boolean
}

const firebaseConfig = {
  apiKey: "AIzaSyBRP5svO-z475RPVb2WIpFFUILjj6wok10",
  authDomain: "projekt-notekeep.firebaseapp.com",
  projectId: "projekt-notekeep",
  storageBucket: "projekt-notekeep.appspot.com",
  messagingSenderId: "828903284668",
  appId: "1:828903284668:web:cfc2c4c12b3c8af2c515b9"
};

class Store {
  firebaseApp: Object;
  db: any;

  init () {
    this.firebaseApp = firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
  }

  addNote (note: NoteType, callback: (id: string) => void) {
    this.db.collection('notes').add(JSON.parse(JSON.stringify(note)))
    .then((docRef: { id: string; }) => {
      callback(docRef.id);
    })
    .catch((error: any) => {
      console.error("Error adding document: ", error);
    });
  }

  getNotes (callback: (notes: NoteType[]) => void) {
    let notes: NoteType[] = [];
    this.db.collection('notes').get().then((querySnapshot: any[]) => {
      querySnapshot.forEach((doc) => {
        notes.push(doc.data());
      });
      callback(notes);
    });
  }

  deleteNote (noteId: string, callback: () => void) {
    this.db.collection("notes").doc(noteId).delete().then(() => {
      callback();
    }).catch((error: any) => {
      console.error("Error removing document: ", error);
    });
  }

  updateNote (noteId: string, {title, body, color, isPinned}: NoteUpdateInterface, callback: () => void) {
    let documentData: NoteUpdateInterface = {};
    if (title) documentData.title = title;
    if (body) documentData.body = body;
    if (color) documentData.color = color;
    if (isPinned) documentData.isPinned = isPinned;

    this.db.collection("notes").doc(noteId).update(documentData).then(() => {
      callback();
    }).catch((error: any) => {
      console.error("Error updating document: ", error);
    });
  }
}
export default Store;