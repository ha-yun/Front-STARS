export const setAppHeight = () => {
    document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
    );
};

export const initializeAppHeight = () => {
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
};
