let data = JSON.parse(localStorage.getItem("purohitData"));

// DISPLAY DATA
document.getElementById("previewData").innerHTML = `
  <p><b>Name:</b> ${data.name}</p>
  <p><b>Phone:</b> ${data.phone}</p>
  <p><b>Email:</b> ${data.email || "Not Provided"}</p>
  <p><b>Password:</b> ******</p>
  <p><b>DOB:</b> ${data.dob}</p>
  <p><b>Vedas:</b> ${data.vedas.join(", ")}</p>
  <p><b>Sub Vedas:</b> ${data.subVedas.join(", ")}</p>
  <p><b>Upanayana:</b> ${data.upanayana}</p>
  <p><b>Married:</b> ${data.married || "N/A"}</p>
  <p><b>Gotram:</b> ${data.gotram}</p>
  <p><b>Upasana:</b> ${data.upasana || "N/A"}</p>
`;

// REGISTER BUTTON
document.getElementById("registerBtn").addEventListener("click", function(){

  let terms = document.getElementById("terms");

  if(!terms.checked){
    alert("Please accept Terms & Conditions / దయచేసి అంగీకరించండి");
    return;
  }

  alert("Registered Successfully!\n\n📲 WhatsApp & Email Sent (Simulated)");

  window.location.href = "login.html";
});