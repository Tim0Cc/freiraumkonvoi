const deleteForm = document.getElementById("deleteForm");
if (deleteForm =! null) {
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let result = confirm("Möchte Sie wirklich löschen?");
    if (result) {
      deleteForm.submit();
    }
  })
}