import { NoteType } from "./types";

export interface LocalStorageInterface {
  saveNotes: (notesList: NoteType[]) => void;
  getNotes: () => NoteType[]
}

class LocalStorage {
  saveNotes (notesList: NoteType[]) {
    if (!!notesList.length) {
      localStorage.setItem('notes', JSON.stringify(notesList));
    } else {
      localStorage.setItem('notes', null);
    }
  }

  getNotes (): NoteType[] {
    return JSON.parse(localStorage.getItem('notes'));
  }
}

export default LocalStorage;