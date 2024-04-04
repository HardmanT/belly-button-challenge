// Function to read samples.json and initialize the dashboard
function init() {
    // Use D3 to read the JSON file
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var samples = data.samples;
        var names = data.names;

        // Populate the dropdown menu with subject IDs
        var dropdownMenu = d3.select("#selDataset");

        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Initialize the dashboard with the first subject ID
        var initialSubject = names[0];
        updateBarChart(initialSubject);
    });
}

// Function to update the bar chart based on the selected subject ID
function updateBarChart(subjectId) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var samples = data.samples;
        var metadata = data.metadata;

        // Filter data for the selected subject ID
        var selectedSample = samples.filter(sample => sample.id === subjectId)[0];
        var otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
        var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

        // Create trace for the bar chart
        var trace = {
            x: sampleValues,
            y: otuIds.map(id => `OTU ${id}`),
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" }
        };

        var data = [trace];

        // Plot the bar chart
        Plotly.newPlot("bar", data, layout);
    });
}

// Function to display demographic information
function displayMetadata(subjectId) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var metadata = data.metadata;

        // Filter metadata for the selected subject ID
        var selectedMetadata = metadata.filter(meta => meta.id.toString() === subjectId)[0];

        // Clear existing metadata
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");

        // Display metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Event listener for dropdown change
function optionChanged(subjectId) {
    updateBarChart(subjectId);
    displayMetadata(subjectId);
}

// Initialize the dashboard
init();


// Function to update the bubble chart based on the selected subject ID
function updateBubbleChart(subjectId) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var samples = data.samples;

        // Filter data for the selected subject ID
        var selectedSample = samples.filter(sample => sample.id === subjectId)[0];

        // Create trace for the bubble chart
        var trace = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: 'Earth',
                opacity: 0.6
            }
        };

        var layout = {
            title: 'Bubble Chart for Sample',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        var data = [trace];

        // Bubble chart
        Plotly.newPlot('bubble', data, layout);
    });
}

// Event listener for dropdown change
function optionChanged(subjectId) {
    updateBarChart(subjectId);
    updateBubbleChart(subjectId);
    displayMetadata(subjectId);}