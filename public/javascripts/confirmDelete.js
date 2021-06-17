const deleteForms = document.getElementsByClassName("deleteForm");
if (deleteForms.length > 0) {
  console.log('in if statement')
  Array.from(deleteForms).forEach((deleteForm) => {
    deleteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let result = confirm("Möchte Sie wirklich löschen?");
      if (result) {
        deleteForm.submit();
      }
    })
  })
}