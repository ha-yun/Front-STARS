import { useState, useRef, useEffect } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import Menu from "./Menu";

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

export default function SearchBarWithMenu({ onSearch }: SearchBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div ref={wrapperRef}>
            {/* SearchBar */}
            <div
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-30 w-11/12 max-w-md bg-white shadow-md flex items-center rounded-full px-2 py-2 transition-all duration-300 ${
                    isMenuOpen
                        ? "bg-opacity-90"
                        : "bg-opacity-60 hover:bg-opacity-90"
                } md:top-6 md:left-6 md:transform-none md:w-96`}
            >
                <button
                    className="flex-shrink-0 bg-transparent text-gray-500 hover:text-gray-700 mr-3 focus:outline-none border-0"
                    onClick={toggleMenu}
                >
                    <FaBars size={20} />
                </button>
                <input
                    type="text"
                    placeholder="궁금하신 장소를 입력하세요!"
                    className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="flex-shrink-0 bg-transparent text-indigo-500 hover:text-indigo-700 transition focus:outline-none border-0"
                    onClick={handleSearch}
                >
                    <FaSearch size={20} />
                </button>
            </div>
            <Menu isOpen={isMenuOpen} />
        </div>
    );
}
