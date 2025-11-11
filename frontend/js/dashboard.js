const accessToken = localStorage.getItem("access");
const username = localStorage.getItem("username");

if (!accessToken) {
  alert("Please login first");
  window.location.href = "login.html";
}

// Welcome user
document.getElementById("welcomeUser").innerText = `Welcome, ${username}`;

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Upload CSV
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("file");
  const files = input.files;

  if (!files || files.length === 0) {
    alert("Select at least one CSV file");
    return;
  }

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/statictables/uploadcsv/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}` },
        body: formData
      });

      if (!res.ok) {
        const txt = await res.text();
        alert("Upload failed: " + txt);
        continue;
      }

      await loadFiles();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error: " + err.message);
    }
  }
});

// Load all uploaded files
async function loadFiles() {
  try {
    const res = await fetch("http://127.0.0.1:8000/statictables/files/", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!res.ok) throw new Error(await res.text());

    const files = await res.json();
    const tbody = document.getElementById("fileTableBody");
    tbody.innerHTML = "";

    files.forEach(file => {
      const isOwner = file.uploaded_by === username || username === "admin";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${file.id}</td>
        <td><a href="#" onclick="loadFileData(${file.id})">${file.file_name}</a></td>
        <td>${file.uploaded_file ? `<a href="${file.uploaded_file}" target="_blank">Download</a>` : '-'}</td>
        <td>${file.file_size}</td>
        <td>${file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : '-'}</td>
        <td>${file.modified_at ? new Date(file.modified_at).toLocaleString() : '-'}</td>
        <td>${file.uploaded_by || '-'}</td>
        <td>${file.modified_by || '-'}</td>
        <td>
          ${isOwner 
            ? `<button class="update-btn" onclick="updateFile(${file.id})">Update</button>
               <button class="delete-btn" onclick="deleteFile(${file.id})">Delete</button>` 
            : '-'
          }
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error loading files:", err);
  }
}

// Update file
async function updateFile(fileId) {
    // Create a temporary hidden input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.style.display = "none";
  
    // Append to body
    document.body.appendChild(input);
  
    // Listen for file selection
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const res = await fetch(`http://127.0.0.1:8000/statictables/update/${fileId}/`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${accessToken}` },
          body: formData
        });
  
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
  
        alert("File updated successfully!");
        await loadFiles();
      } catch (err) {
        console.error("Update error:", err);
        alert("Update failed: " + err.message);
      } finally {
        // Remove input after use
        document.body.removeChild(input);
      }
    });
  
    // Trigger file selector
    input.click();
  }
  

// Delete file
async function deleteFile(fileId) {
  if (!confirm("Are you sure you want to delete this file?")) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/statictables/delete/${fileId}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }

    await loadFiles();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Delete failed: " + err.message);
  }
}

// Load CSV rows for a specific file
async function loadFileData(fileId) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/statictables/file-data/${fileId}/`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }

    const rows = await res.json();
    renderTableData(rows);
  } catch (err) {
    console.error("Error loading CSV:", err);
    alert("Failed to load CSV data: " + err.message);
  }
}

// Render CSV table
function renderTableData(rows) {
  const tbody = document.querySelector("#tableData tbody");
  tbody.innerHTML = "";

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10">No data found</td></tr>`;
    return;
  }

  rows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.time}</td>
      <td>${row.xecef}</td>
      <td>${row.yecef}</td>
      <td>${row.zecef}</td>
      <td>${row.vxecef}</td>
      <td>${row.vyecef}</td>
      <td>${row.vzecef}</td>
      <td>${row.lat}</td>
      <td>${row.lon}</td>
      <td>${row.alt}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Init
window.onload = async () => {
  await loadFiles();
};
