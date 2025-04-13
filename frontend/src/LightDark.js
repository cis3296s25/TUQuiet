const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(e) {
  if (e.matches) {
    document.documentElement.classList.add("dark");
    console.log("DARK MODE");
  } else {
    document.documentElement.classList.remove("dark");
    console.log("LIGHT MODE");
  }
}

// Initial check on page load
applyTheme(themeQuery);

// Listen for changes while the page is open
themeQuery.addEventListener("change", applyTheme);
