// PHOTO PREVIEW
document.getElementById("photo").addEventListener("change", function(e){
  let file = e.target.files[0];
  if(file){
    document.getElementById("previewImg").src = URL.createObjectURL(file);
  }
});

// PHONE VALIDATION
document.getElementById("phone").addEventListener("input", function(){
  this.value = this.value.replace(/[^0-9]/g, '');
});

// TAG SYSTEM
let input = document.getElementById("tagInput");
let tagsContainer = document.getElementById("tags");

input.addEventListener("keydown", function(e){
  if(e.key === "Enter" && input.value.trim() !== ""){
    e.preventDefault();
    createTag(input.value.trim());
    input.value = "";
  }
});

function createTag(text){
  let tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `${text} <span onclick="this.parentElement.remove()">×</span>`;
  tagsContainer.appendChild(tag);
}

// SUGGESTIONS
document.querySelectorAll(".sub-veda-suggestions span").forEach(el=>{
  el.onclick = () => createTag(el.innerText);
});

// UPANAYANA
document.getElementById("upanayana").addEventListener("change", function(){
  document.getElementById("marriageSection").style.display =
    this.value === "yes" ? "block" : "none";
});

// FORM SUBMIT
document.getElementById("registerForm").addEventListener("submit", function(e){
  e.preventDefault();

  let pass = document.getElementById("password").value;
  let confirm = document.getElementById("confirmPassword").value;

  if(pass !== confirm){
    alert("Passwords do not match / పాస్‌వర్డ్ సరిపోలడం లేదు");
    return;
  }

  alert("All good! Ready for Preview 🚀");
});