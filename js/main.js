const elThemeToggler = document.querySelector('.js-theme-toggler');

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    elThemeToggler.textContent = "Light Mode";
}

if (elThemeToggler) {
    elThemeToggler.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            elThemeToggler.textContent = "Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            elThemeToggler.textContent = "Dark Mode";
        }
    });
}