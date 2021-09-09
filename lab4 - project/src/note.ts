import { parseDate } from './utils';

import { NoteType } from './types';

interface NoteConstructorProps {
  title: string,
  body?: string,
  id: string,
  color: string
}

export class Note {
  id: string;
  title: string;
  body: string;
  color: string;
  isPinned: boolean;
  creationDate: Date;

  constructor ({title, body, id, color}: NoteConstructorProps) {
    this.creationDate = new Date();
    this.isPinned = false;
    this.color = '#fff';
    this.id = id;
    this.color = color;

    this.title = title;
    this.body = body || '';
  }

  render (note: NoteType) {
    const {id, title, body, isPinned, creationDate, color} = note;
    return `
      <div data-id="${id}" class="note${isPinned ? ' note--pinned' : ''}" style="background-color: ${color}">
        <div class="note__header">
          <h3>${title}</h3>
          
          <div class="note__controls">
            <img data-id="${id}" class="pin" src="./assets/icons/star.svg" alt="Pin note" />
            <img data-id="${id}" class="edit" src="./assets/icons/edit.svg" alt="Edit note" />
            <img data-id="${id}" class="delete" src="./assets/icons/trash.svg" alt="Delete note" />
          </div>
        </div>
        
        <div class="note__meta">
          <span>Created: ${parseDate(new Date(creationDate), true)}</span>
        </div>
        
        <div class="note__body">
          <p>${body}</p>
        </div>
      </div>
    `;
  }
}

export default Note;