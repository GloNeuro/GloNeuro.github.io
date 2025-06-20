import React, { useRef, useState, useEffect } from 'react';
import './BlogCard.css';
import { gsap } from 'gsap';

const BlogCard = ({ date, title, content, ref, ref2 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cursorRef = ref
  const mainRef = ref2
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const a_date = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = a_date.toLocaleDateString(undefined, options);

  // Scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  // Cursor animation effect
  useEffect(() => {
    const main = mainRef.current;
    const cursor = cursorRef.current;
    if (!main || !cursor) return;

    // Initially hide cursor
    cursor.style.opacity = 0;


    const mouseMoveHandler = (event) => {
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.1,
      });
    };

    const mouseEnterHandler = () => {
      cursor.innerHTML = 'READ MORE';
      gsap.to(cursor, {
        scale: 2,
        opacity: 1,
        backgroundColor: '#ffffff8a',
      });
    };

    const mouseLeaveHandler = () => {
      cursor.innerHTML = '';
      gsap.to(cursor, {
        scale: 1,
        opacity:0,
        backgroundColor: '#fff',
      });
    };

    main.addEventListener('mousemove', mouseMoveHandler);
    main.addEventListener('mouseenter', mouseEnterHandler);
    main.addEventListener('mouseleave', mouseLeaveHandler);

    return () => {
      main.removeEventListener('mousemove', mouseMoveHandler);
      main.removeEventListener('mouseenter', mouseEnterHandler);
      main.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        id="cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#fff',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          fontWeight: 'bold',
          userSelect: 'none',
          transformOrigin: 'center',
          zIndex: 9999,
          opacity: 1,
          transition: 'background-color 0.3s ease',
        }}
      ></div>

      <div
        ref={mainRef}
        className="blog-card cursor-pointer"
        style={{ overflow: 'hidden' }}
        onClick={openModal}
      >
        <h3 className="hover:underline" dangerouslySetInnerHTML={{ __html: formatted }} />
        <h3 className="hover:underline" dangerouslySetInnerHTML={{ __html: title }} />
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
              className="!bg-gray-600 hover:!bg-red-600 text-black dark:text-white hover:text-gray-600 absolute top-0 right-1.5 !px-2 !py-1 !rounded-full !text-lg font-bold"
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

export default BlogCard;
