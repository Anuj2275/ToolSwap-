import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  const imageUrl = tool.imageUrl && tool.imageUrl.startsWith('http') ? tool.imageUrl : null;

return (
    <Link
        to={`/tool/${tool.id}`}
        className="group block bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-border-light dark:border-border-dark hover:shadow-xl hover:border-primary dark:hover:border-primary-light transition-all duration-300 ease-in-out transform hover:-translate-y-1" // Added transform
    >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-600"> {/* Added background color */}
             {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={tool.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.querySelector('.placeholder-icon')?.classList.remove('hidden'); }} // Show placeholder div on error
                />
             ) : null} {/* Render nothing initially if no imageUrl */}
             {/* Placeholder Icon Div - Shown if no image or on error */}
            <div className={`placeholder-icon absolute inset-0 flex items-center justify-center text-muted-light dark:text-muted-dark ${imageUrl ? 'hidden' : ''}`}> {/* Hidden if imageUrl exists */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
        {/* Content Area */}
        <div className="p-4">
            <p className="text-xs text-primary dark:text-primary-light font-semibold mb-1 uppercase tracking-wider">{tool.category || 'Uncategorized'}</p> {/* Enhanced category style */}
            <h3 className="text-md font-semibold text-text-light dark:text-text-dark truncate group-hover:text-primary dark:group-hover:text-primary-light transition-colors" title={tool.name}>
                {tool.name}
            </h3>
            {tool.owner && (
               <p className="text-xs text-muted-light dark:text-muted-dark mt-2">By {tool.owner.name}</p> 
            )}
        </div>
    </Link>
);
};

export default ToolCard;
