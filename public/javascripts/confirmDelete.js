console.log("inside confirmDelete.js")
const deleteForm = document.getElementById("deleteForm");
deleteForm.addEventListener("submit", (e) => {
  console.log("event: " + e)
  e.preventDefault();
  let result = confirm("Möchte Sie wirklich löschen?");
  console.log("result: " + result)
  if (result) {
    deleteForm.submit();
  }
})