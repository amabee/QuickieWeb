"use client";
import React from 'react'
import Header from '../components/header'
import '../../public/styles/style.css';
import Post from '../components/post'
import SideMenu from '../components/sidemenu';
import Navbar from '../components/navbar';
import { useRef, useEffect } from 'react';

const Home = () => {
//     const storiesContentRef = useRef(null);
//   const storiesLeftButtonRef = useRef(null);
//   const storiesRightButtonRef = useRef(null);
//   const postsRef = useRef([]);

//   useEffect(() => {
//     // Set initial theme
//     const themeKey = localStorage.getItem('theme');
//     document.documentElement.classList.toggle('darkTheme', themeKey === 'dark');

//     const toggleTheme = () => {
//       document.documentElement.classList.toggle('darkTheme');
//       localStorage.setItem('theme', document.documentElement.classList.contains('darkTheme') ? 'dark' : 'light');
//     };

//     const leftButton = storiesLeftButtonRef.current;
//     const rightButton = storiesRightButtonRef.current;

//     leftButton.addEventListener('click', () => storiesContentRef.current.scrollLeft -= 320);
//     rightButton.addEventListener('click', () => storiesContentRef.current.scrollLeft += 320);

//     const storiesObserver = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if (entry.target === storiesContentRef.current.firstChild) {
//           leftButton.style.display = entry.isIntersecting ? 'none' : 'unset';
//         } else if (entry.target === storiesContentRef.current.lastChild) {
//           rightButton.style.display = entry.isIntersecting ? 'none' : 'unset';
//         }
//       });
//     }, { root: storiesContentRef.current, threshold: 1 });

//     const stories = storiesContentRef.current.children;
//     storiesObserver.observe(stories[0]);
//     storiesObserver.observe(stories[stories.length - 1]);

//     return () => {
//       leftButton.removeEventListener('click', () => {});
//       rightButton.removeEventListener('click', () => {});
//     };
//   }, []);
  return (
    <div>
     <Header/>
     <Post/>
     <SideMenu/>
     <Navbar/>
    </div>
  )
}

export default Home
