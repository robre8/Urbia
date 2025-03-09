import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdThumbUp, 
  MdFavorite, 
  MdThumbDown 
} from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";

const reactions = [
  { 
    id: "like", 
    label: "Me gusta", 
    color: "bg-blue-500", 
    icon: <MdThumbUp className="w-8 h-8" /> 
  },
  { 
    id: "divertido", 
    label: "Me divierte", 
    color: "bg-teal-500", 
    icon: <GiPartyPopper className="w-8 h-8" /> 
  },
  { 
    id: "dislike", 
    label: "Me decepciona", 
    color: "bg-gray-500", 
    icon: <MdThumbDown className="w-8 h-8" /> 
  },
  { 
    id: "love", 
    label: "Me encanta", 
    color: "bg-red-500", 
    icon: <MdFavorite className="w-8 h-8" /> 
  },
];

export default function UrbiaLikes() {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
      setHoveredIndex(null);
    }, 200);
  };

  const handleSelectReaction = (reaction) => {
    setSelectedReaction(reaction);
    setShowReactions(false);
  };

  return (
    <div className="relative inline-block z-[9999]">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center space-x-1 text-gray-700 text-sm"
      >
        <MdThumbUp className="w-4 h-4 md:w-3 md:h-3" />
        <span>Recomendar</span>
        {selectedReaction && (
          <span className="ml-1 text-xs">{selectedReaction.icon}</span>
        )}
      </button>

      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute bottom-full mb-2 flex space-x-1 rounded-full bg-white p-1 shadow-xl z-10"
          >
            {reactions.map((r, index) => (
              <div key={r.id} className="relative group">
                <motion.button
                  whileHover={{
                    scale: 1.3,
                    y: -10,
                    x: hoveredIndex !== null ? (index < hoveredIndex ? -4 : 4) : 0,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{
                    scale: 1.3,
                    y: -10,
                    x: 0,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  initial={{ scale: 1, y: 0, x: 0 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSelectReaction(r)}
                  className={`w-10 h-10 md:w-8 md:h-8 rounded-full text-white flex items-center justify-center ${r.color}`}
                >
                  {r.icon}
                </motion.button>
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-2 py-1 text-xs bg-gray-800 text-white rounded transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                  {r.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
