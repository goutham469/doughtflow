import React, { useState } from 'react';
import './DragDrop.css';

const availableTags = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Java', 'SQL', 'Machine Learning', 'Development', 'AWS', 'GCP'];

const TechTags = ({ handler }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [draggedTag, setDraggedTag] = useState(null);

  const handleDragStart = (tag) => {
    setDraggedTag(tag);
  };

  const handleDropAvailable = () => {
    if (draggedTag) {
      const updatedTags = selectedTags.filter((tag) => tag !== draggedTag); // Remove tag from selected
      setSelectedTags(updatedTags);
      setDraggedTag(null);

      handler(updatedTags); // Pass the updated list to the handler
    }
  };

  const handleDropSelected = () => {
    if (draggedTag && !selectedTags.includes(draggedTag)) {
      const updatedTags = [...selectedTags, draggedTag]; // Add tag to selected
      setSelectedTags(updatedTags);
      setDraggedTag(null);
      
      handler(updatedTags); // Pass the updated list to the handler
    }
  };

  return (
    <div className="tech-tags-container">
      <div className="tags-list">
        <h3>Available Tags</h3>
        <div className="available-tags" onDrop={handleDropAvailable} onDragOver={(e) => e.preventDefault()}>
          {availableTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
            <div
              key={tag}
              className="tag"
              draggable
              onDragStart={() => handleDragStart(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="tags-list">
        <h3>Selected Tags</h3>
        <div className="selected-tags" onDrop={handleDropSelected} onDragOver={(e) => e.preventDefault()}>
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="tag"
              draggable
              onDragStart={() => handleDragStart(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechTags;
