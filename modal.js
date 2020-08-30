// Get the modal
var modal = document.getElementById("errorModal");

// When the user clicks on <span> (x), close the modal
function closeModal() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {    
  if (event.target == modal) {
    closeModal();
  }
}