/**
 * GitHub Stats Fetcher
 * Fetches and displays GitHub statistics with scroll-triggered animation
 */

(async function() {
    'use strict';

    const username = 'phpfc';
    let stats = null;
    let hasAnimated = false;

    // Fetch GitHub stats
    async function fetchGitHubStats() {
        try {
            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user data');
            const userData = await userResponse.json();

            // Fetch repos data
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (!reposResponse.ok) throw new Error('Failed to fetch repos data');
            const reposData = await reposResponse.json();

            // Calculate stats
            const stats = {
                repos: userData.public_repos,
                stars: reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0),
                commits: '500+' // Approximate, as exact count requires more API calls
            };

            return stats;
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            return {
                repos: '--',
                stars: '--',
                commits: '--'
            };
        }
    }

    // Animate numbers
    function animateValue(element, start, end, duration) {
        if (end === '--' || typeof end === 'string') {
            element.textContent = end;
            return;
        }

        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    // Animate all stats
    function animateStats() {
        if (!stats || hasAnimated) return;

        const reposEl = document.getElementById('gh-repos');
        const starsEl = document.getElementById('gh-stars');
        const commitsEl = document.getElementById('gh-commits');

        if (stats.repos !== '--') {
            animateValue(reposEl, 0, stats.repos, 1000);
            animateValue(starsEl, 0, stats.stars, 1200);
        } else {
            reposEl.textContent = stats.repos;
            starsEl.textContent = stats.stars;
        }

        commitsEl.textContent = stats.commits;
        hasAnimated = true;
    }

    // Set up intersection observer for scroll trigger
    function setupScrollTrigger() {
        const githubSection = document.querySelector('.github-activity-compact');
        if (!githubSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateStats();
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% visible
        });

        observer.observe(githubSection);
    }

    // Initialize
    stats = await fetchGitHubStats();

    // Set initial placeholder values
    document.getElementById('gh-repos').textContent = '0';
    document.getElementById('gh-stars').textContent = '0';
    document.getElementById('gh-commits').textContent = '0';

    // Setup scroll trigger
    setupScrollTrigger();

})();
