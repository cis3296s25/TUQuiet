const themeQuery = window.matchMedia("(prefers-color-scheme: light)");

function applyTheme(e) {
  if (e.matches) {
    document.documentElement.classList.add("light");
    console.log("LIGHT MODE");
  } else {
    document.documentElement.classList.remove("light");
    console.log("DARK MODE");
  }
}

// Initial check on page load
applyTheme(themeQuery);

// Listen for changes while the page is open
themeQuery.addEventListener("change", applyTheme);
