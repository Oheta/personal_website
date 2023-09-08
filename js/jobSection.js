// Define your job data
const jobData = [
    { company: "Company A", position: "Web Developer", year: "2020-2021" },
    { company: "Company B", position: "Software Engineer", year: "2018-2019" },
    // Add more job entries as needed
];

// Function to create job cards
function createJobCards() {
    const jobContainer = document.querySelector('#jobSection');

    jobData.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        jobCard.innerHTML = `
            <h2>${job.company}</h2>
            <p>${job.position}</p>
            <p>${job.year}</p>
        `;
        jobContainer.appendChild(jobCard);
    });
}

// Call the function to create job cards when the page loads
window.addEventListener('load', createJobCards);
