const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Login failed: " + (err.detail || JSON.stringify(err)));
      return;
    }

    const data = await res.json();
    
    // Store access, refresh token and username in localStorage
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("username", data.username);  // <--- store username

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Login error: " + err.message);
  }
});
