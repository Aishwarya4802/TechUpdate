function timeAgo(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        return 'just now';
    }
    if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60);
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600);
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (secondsPast < 2592000) {
        const days = Math.floor(secondsPast / 86400);
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    
    // Optionally, you can extend this for months and years as needed.
    return date.toDateString(); // fallback for dates older than a month
}

// Example usage:
const postDate = new Date('2024-07-09T10:00:00'); // replace with your date
console.log(timeAgo(postDate));