export function scrollToTop(container: HTMLElement | null) {
    if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
    }
}
