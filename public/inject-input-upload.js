function injectInputUpload() {
  const input = document.createElement("input");
  input.id = "ddb-qm-input-upload";
  input.type = "file";
  input.accept = ".json,application/json";
  document.body.appendChild(input);
}

injectInputUpload();
