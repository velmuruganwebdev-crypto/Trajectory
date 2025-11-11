const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Username and password required");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert("Register failed: " + JSON.stringify(error));
      return;
    }

    alert("Registered successfully! Redirecting to login...");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
});
