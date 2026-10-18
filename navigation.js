(() => {
    "use strict";

    const initialiseNavigation = () => {
        const container = document.querySelector(".nav-container");
        const navigation = document.querySelector(".nav-menu");
        const menuButton = document.querySelector(".menu-icon");
        const courseDropdown = document.querySelector(".courses-nav-dropdown");
        const courseButton = document.querySelector(".courses-nav-btn");
        const courseMenu = document.querySelector(".courses-nav-menu");

        if (!container || !navigation || !menuButton) {
            return;
        }

        const isMobileMenu = () => window.matchMedia("(max-width: 900px)").matches;

        const setMenuOpen = (isOpen) => {
            const shouldOpenOnMobile = isOpen && isMobileMenu();
            navigation.classList.toggle("is-open", shouldOpenOnMobile);
            navigation.setAttribute("aria-hidden", String(!shouldOpenOnMobile));
            menuButton.setAttribute("aria-expanded", String(shouldOpenOnMobile));
            menuButton.setAttribute(
                "aria-label",
                shouldOpenOnMobile ? "Close navigation menu" : "Open navigation menu"
            );

            if (!shouldOpenOnMobile) {
                navigation.classList.remove("is-open");
            }

            if (!isOpen) {
                setCourseMenuOpen(false);
            }
        };

        const setCourseMenuOpen = (isOpen) => {
            if (!courseDropdown || !courseButton || !courseMenu) {
                return;
            }

            courseDropdown.classList.toggle("open", isOpen);
            courseButton.setAttribute("aria-expanded", String(isOpen));
            courseMenu.hidden = !isOpen;
            courseMenu.setAttribute("aria-hidden", String(!isOpen));
        };

        const closeMenus = () => {
            setMenuOpen(false);
            setCourseMenuOpen(false);
        };

        setMenuOpen(false);
        setCourseMenuOpen(false);

        menuButton.addEventListener("click", () => {
            const nextState = !navigation.classList.contains("is-open");
            setMenuOpen(nextState);
        });

        if (courseButton && courseMenu) {
            courseButton.addEventListener("click", (event) => {
                event.stopPropagation();
                setCourseMenuOpen(!courseDropdown.classList.contains("open"));
            });

            courseButton.addEventListener("keydown", (event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                    return;
                }

                event.preventDefault();
                setCourseMenuOpen(true);

                const links = courseMenu.querySelectorAll("a[href]");
                const target = event.key === "ArrowDown" ? links[0] : links[links.length - 1];
                target?.focus();
            });

            courseMenu.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setCourseMenuOpen(false);
                    courseButton.focus();
                }
            });
        }

        navigation.addEventListener("click", (event) => {
            const link = event.target.closest("a[href]");
            if (!link) {
                return;
            }

            setCourseMenuOpen(false);
            setMenuOpen(false);
        });

        document.addEventListener("click", (event) => {
            if (!container.contains(event.target)) {
                closeMenus();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") {
                return;
            }

            const courseWasOpen = courseDropdown?.classList.contains("open");
            const menuWasOpen = navigation.classList.contains("is-open");
            closeMenus();

            if (courseWasOpen && courseButton) {
                courseButton.focus();
            } else if (menuWasOpen) {
                menuButton.focus();
            }
        });

        const mediaQuery = window.matchMedia("(max-width: 900px)");
        const handleViewChange = () => {
            if (!mediaQuery.matches) {
                navigation.classList.remove("is-open");
                navigation.setAttribute("aria-hidden", "false");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
                setCourseMenuOpen(false);
            }
        };

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleViewChange);
        } else if (typeof mediaQuery.addListener === "function") {
            mediaQuery.addListener(handleViewChange);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiseNavigation, { once: true });
    } else {
        initialiseNavigation();
    }
})();
