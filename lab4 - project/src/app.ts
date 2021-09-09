import Notes from './notes';
import Note from './note';
import AddNote from './addNote';
import EditNote from './editNote';
import LocalStorage, { LocalStorageInterface } from './LocalStorage';
import Store from './store';
import { NoteType, AddNoteType } from './types';

export default class App {
    notesList: NoteType[];
    containerElement: HTMLElement;
    localStorageClient: LocalStorageInterface;
    store: Store;

    constructor(containerElement: HTMLElement) {
      this.localStorageClient = new LocalStorage();
      this.store = new Store();
      this.store.init();

      let notesFromFirestore: NoteType[] = [];
      this.store.getNotes((notes) => {
          notesFromFirestore = notes;
      });

      const notesFromStorage = this.localStorageClient.getNotes();
      if (notesFromFirestore && !!notesFromFirestore.length) {
        this.notesList = notesFromFirestore;
      } else if (notesFromStorage && !!notesFromStorage.length) {
        this.notesList = notesFromStorage;
      } else {
        this.notesList = [];
      }

      this.containerElement = containerElement;
      this.render();
    }

    writeState () {
      this.localStorageClient.saveNotes(this.notesList);
    }

    deleteNote (noteId: string) {
        this.store.deleteNote(noteId, () => {
          this.notesList = this.notesList.filter(note => note.id !== noteId);
          this.render();
          this.writeState();
        })
    }

    addNote ({title, body, color} : AddNoteType) {
      const note = new Note({
        title, body,
        id: null,
        color
      });

      this.store.addNote(note, (id: string) => {
        note.id = id;
        this.notesList.push(note);
        this.render();
        this.writeState();
      });
    }

    pinNoteToggle (noteId: string, shouldPin: boolean) {
      this.store.updateNote(noteId, {isPinned: shouldPin}, () => {
        this.notesList.map(note => {
          if (note.id === noteId) {
            note.isPinned = shouldPin;
          }
          return note;
        });
        this.render();
        this.writeState();
      });
    }

    updateNote (noteId: string, title: string, body: string, color: string) {
      this.store.updateNote(noteId, {title, body, color}, () => {
        this.notesList.map(note => {
          if (note.id === noteId) {
            note.title = title;
            note.body = body;
            note.color = color;
          }
          return note;
        });
        this.render();
        this.writeState();
      });
    }

    addEvents () {
        document.querySelectorAll('.note .delete').forEach(noteEl => {
            noteEl.addEventListener('click', (ev) => {
              const noteId = (ev.currentTarget as HTMLElement).dataset.id;
                this.deleteNote(noteId);
            });
        })

        document.querySelectorAll('.note .pin').forEach(noteEl => {
          noteEl.addEventListener('click', (ev) => {
            const noteId = (ev.currentTarget as HTMLElement).dataset.id;
            const isCurrentlyPinned = this.notesList.find(({id}) => noteId === id).isPinned;
            this.pinNoteToggle(noteId, !isCurrentlyPinned);
          });
        })

        document.querySelectorAll('.note .edit').forEach(noteEl => {
          noteEl.addEventListener('click', (ev) => {
            const noteId = (ev.currentTarget as HTMLElement).dataset.id;
            const note = this.notesList.find(({id}) => id === noteId);

            const editNoteEl = document.querySelector('.edit-note');
            editNoteEl.classList.add('is-active');

            (editNoteEl.querySelector('input[name="title"]') as HTMLInputElement).value = note.title;
            (editNoteEl.querySelector('input[name="id"]') as HTMLInputElement).value = note.id.toString();
            (editNoteEl.querySelector('input[name="color"]') as HTMLInputElement).value = note.color;
            (editNoteEl.querySelector('textarea[name="body"]') as HTMLInputElement).value = note.body;
          });
        })

        document.querySelector('.add-note-btn').addEventListener('click', () => {
          document.querySelector('.add-note').classList.add('is-active');
        })

        document.querySelector('.add-note .close-modal').addEventListener('click', () => {
            document.querySelector('.add-note').classList.remove('is-active');
        })

        document.querySelector('.edit-note .close-modal').addEventListener('click', () => {
          document.querySelector('.edit-note').classList.remove('is-active');
        })


        document.querySelector('.add-note form').addEventListener('submit', ev => {
          ev.preventDefault();
          const title = ((ev.target as HTMLElement).querySelector('input[name="title"]') as HTMLInputElement).value;
          const body = ((ev.target as HTMLElement).querySelector('textarea[name="body"]') as HTMLInputElement).value;
          const color = ((ev.target as HTMLElement).querySelector('input[name="color"]') as HTMLInputElement).value;

          if (title && body && color) {
            this.addNote({title, body, color});
          }
        })

        document.querySelector('.edit-note form').addEventListener('submit', ev => {
          ev.preventDefault();
          const id = ((ev.target as HTMLElement).querySelector('input[name="id"]') as HTMLInputElement).value;
          const title = ((ev.target as HTMLElement).querySelector('input[name="title"]') as HTMLInputElement).value;
          const body = ((ev.target as HTMLElement).querySelector('textarea[name="body"]') as HTMLInputElement).value;
          const color = ((ev.target as HTMLElement).querySelector('input[name="color"]') as HTMLInputElement).value;

          if (title && body && color) {
            this.updateNote(id, title, body, color);
          }
        })
    }

    render () {
        this.containerElement.innerHTML = new Notes().render(this.notesList);
        this.containerElement.innerHTML += new AddNote().render();
        this.containerElement.innerHTML += new EditNote().render();
        this.addEvents();
    }
};