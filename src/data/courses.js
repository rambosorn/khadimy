export const courses = [
    {
        id: 'web-dev-fundamental',
        title: 'Web Development Level 1',
        overview: 'Build your first responsive website using HTML, CSS, and modern design principles. No prior experience required.',
        outcomes: [
            'Understand HTML5 semantic structure',
            'Master CSS Flexbox and Grid',
            'Deploy websites to Netlify/Vercel',
            'Use VS Code and DevTools like a pro'
        ],
        audience: 'Beginners, Students, Career Switchers',
        tools: ['VS Code', 'Chrome DevTools', 'Git', 'GitHub'],
        mode: 'Hybrid (Online + Weekend Workshops)',
        duration: '6 Weeks',
        instructor: {
            name: 'Sokha Visal',
            role: 'Senior Frontend Engineer',
            bio: '5+ years experience building web apps for local fintech startups.'
        },
        featured: true
    },
    {
        id: 'react-mastery',
        title: 'Modern React & UI/UX',
        overview: 'Deep dive into React, State Management, and building complex interactive UIs.',
        outcomes: [
            'Component-based architecture',
            'React Hooks & Custom Hooks',
            'State Management (Context API)',
            'Integrating with REST APIs'
        ],
        audience: 'Frontend Developers, CS Students',
        tools: ['React', 'Vite', 'Figma', 'Postman'],
        mode: 'Online Live',
        duration: '8 Weeks',
        instructor: {
            name: 'Dara Sophea',
            role: 'Tech Lead @ TechKhmer',
            bio: 'Specialist in scalable frontend architectures.'
        },
        featured: true
    },
    {
        id: 'data-analytics-intro',
        title: 'Data Analytics for Business',
        overview: 'Learn to make data-driven decisions using Excel, SQL, and PowerBI.',
        outcomes: [
            'Data cleaning and preparation',
            'SQL basics for data querying',
            'Building interactive dashboards',
            'Business intelligence storytelling'
        ],
        audience: 'Business Majors, Marketers, Junior Analysts',
        tools: ['Excel', 'SQL', 'PowerBI'],
        mode: 'Physical (Phnom Penh)',
        duration: '4 Weeks',
        instructor: {
            name: 'Chea Rithy',
            role: 'Data Analyst',
            bio: 'Helping businesses uncover insights from data.'
        },
        featured: false
    }
];
