export interface NoteType {
  title: string;
  body: string;
  color: string;
  isPinned: boolean;
  creationDate: Date;
  render: (note: NoteType) => void;
  id: string;
}

export interface AddNoteType {
  title: string;
  body: string;
  color: string;
}