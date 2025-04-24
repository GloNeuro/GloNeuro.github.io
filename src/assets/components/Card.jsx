import React, { useState, useEffect } from 'react';
import './Card.css';

const Card = ({ title, content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="card cursor-pointer" style={{ overflow: 'hidden' }} onClick={openModal}>
        <h3
          className="hover:underline"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-gray-600 max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl max-w-6xl w-full relative scroll-smooth"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="!bg-gray-600 hover:!bg-red-600 text-white hover:text-gray-600 absolute top-0 right-1.5 !px-2 !py-1 !rounded-full !text-lg font-bold"
              onClick={closeModal}
            >
              x
            </button>
            <h3
              className="text-2xl font-bold mb-4 text-center"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div className="post-content prose text-justify space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
