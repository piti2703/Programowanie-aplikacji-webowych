class EditNote {
  render () {
    return `
      <div class="edit-note">
        <h3>Edit note</h3>
        
        <form action="">
          <input type="text" name="title" placeholder="Title name">
          <input type="color" name="color" />
          <textarea name="body" id="" cols="30" rows="10" placeholder="Body of your note"></textarea>
          <input type="hidden" name="id" />
          <button class="btn">Save note</button>
        </form>
        
        
        <img class="close-modal" src="./assets/icons/x.svg" alt="Exit" />
      </div>
    `;
  }
}

export default EditNote;