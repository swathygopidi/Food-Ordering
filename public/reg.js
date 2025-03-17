
        document.getElementById("registerForm").addEventListener("submit", async function(event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/register_cust", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                alert(data.message);

                if (data.success) {
                    window.location.href = data.redirect; // Redirect to custform.html
                }
            } catch (error) {
                alert("Server error. Please try again later.");
            }
        });
    
