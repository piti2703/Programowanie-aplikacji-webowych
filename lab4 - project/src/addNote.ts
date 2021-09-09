class AddNote {
  render () {
    return `
      <div class="add-note">
        <h3>Add new note</h3>
        
        <form action="">
          <input type="text" name="title" placeholder="Title name">
          <input type="color" name="color" value="#ffffff"/>
          <textarea name="body" id="" cols="30" rows="10" placeholder="Body of your note"></textarea>
          <button class="btn">Add note</button>
        </form>
        
        
        <img class="close-modal" src="./assets/icons/x.svg" alt="Exit" />
      </div>
    `;
  }
}

export default AddNote;