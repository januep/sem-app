import { useState } from 'react';

// Sample terms data - in a real implementation this would be passed as props
const sampleTerms = [
  { id: 1, term: "CSR", definition: "Client Side Rendering - The browser downloads a minimal HTML page and JavaScript, then renders the content directly in the browser." },
  { id: 2, term: "SSR", definition: "Server Side Rendering - The server generates the full HTML for a page on each request, sending a fully populated page to the client." },
  { id: 3, term: "SSG", definition: "Static Site Generation - Pages are generated at build time rather than on request, creating pre-rendered HTML files that can be served quickly." },
  { id: 4, term: "ISR", definition: "Incremental Static Regeneration - A hybrid approach that allows you to update static content after you've built your site." },
  { id: 5, term: "TBT", definition: "Total Blocking Time - A Core Web Vital that measures the total amount of time that a page is blocked from responding to user input." },
  { id: 6, term: "LCP", definition: "Largest Contentful Paint - A Core Web Vital that measures loading performance. It marks the point when the page's main content has likely loaded." }
];

export default function GlossaryCards() {
  // Track which cards are flipped
  const [flippedCards, setFlippedCards] = useState({});
  
  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Concepts</h2>
      
      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTerms.map((item) => (
          <div 
            key={item.id}
            className="w-full h-48 relative cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => toggleFlip(item.id)}
          >
            <div 
              className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
                flippedCards[item.id] ? 'rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: "preserve-3d", 
                transform: flippedCards[item.id] ? "rotateY(180deg)" : "rotateY(0deg)" 
              }}
            >
              {/* Front of card - Term */}
              <div 
                className="absolute w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg p-6 flex justify-center items-center hover:shadow-xl transition-shadow"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h3 className="text-4xl font-bold text-center">{item.term}</h3>
              </div>
              
              {/* Back of card - Definition */}
              <div 
                className="absolute w-full h-full rounded-xl bg-white border-2 border-blue-500 p-6 flex items-center justify-center shadow-lg"
                style={{ 
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <p className="text-gray-800 text-center">{item.definition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        Click on any card to reveal its definition
      </div>
    </div>
  );
}