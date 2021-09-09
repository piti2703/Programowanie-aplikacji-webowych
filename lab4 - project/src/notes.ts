import Note from './note';
import { NoteType } from './types';

export class Notes {
  render (notes: NoteType[]) {
    if (notes && notes.length) {
      const sortedNotes = notes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (a.isPinned === b.isPinned) return 0
        if (b.isPinned && !a.isPinned) return 1
      })

      return `
      <div class="notes-list">
        ${sortedNotes.map(note => Note.prototype.render(note)).join('')}
        <button class="add-note-btn">
            <img src="./assets/icons/plus-square.svg" alt="Add note" />
        </button>
      </div>
    `;
    } else {
      return `
      <div class="notes-list">
        <button class="add-note-btn">
            <img src="./assets/icons/plus-square.svg" alt="Add note" />
        </button>
      </div>
    `;
    }
  }
}

export default Notes;