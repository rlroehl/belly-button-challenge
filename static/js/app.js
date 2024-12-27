// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Use the list of sample names to populate the select options
    d3.select("#selDataset")
      .selectAll("option")
      .data(data.names)
      .enter()
      .append("option")
      .text(function(d) { return d; })  
      .attr("value", function(d) { return d; });  

    // Get the first sample from the list
    let sample = data.names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(sample);
    buildCharts(sample);
  });
}


// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata=data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    let sampleData = metadata.filter(obj => obj.id === +sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    panel.html("");

    // Append new tags for each key-value in the filtered metadata
    Object.entries(sampleData).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`); // Append each key-value pair
    });

  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    let sampleData2 = samples.filter(obj => obj.id === String(sample))[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData2.otu_ids;
    let otu_labels = sampleData2.otu_labels;
    let sample_values = sampleData2.sample_values;

    // Build a Bubble Chart
    let bubbleData = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      type: 'scatter',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        showscale: true
      },
      hoverinfo: 'text'
    };
    
    let bubbleLayout = {
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      },
      title: 'Bacteria Cultures per Sample'
    };
      
    // Plotly.newPlot("bubblePlot", bubbleData, bubbleLayout);
    // Render the Bubble Chart
    let bubbleDiv = document.getElementById('bubblePlot');
    if (bubbleDiv && bubbleDiv._plotly === undefined) {
      Plotly.newPlot("bubblePlot", [bubbleData], bubbleLayout);
    } else {
      Plotly.react("bubblePlot", [bubbleData], bubbleLayout);
    }

    // Build a Bar Chart
    // Bar Chart yticks
    otu_ids_str = otu_ids.map(id => "OTU " + id);

    // Slice and reverse the data for the top 10 values
    let topSampleValues = sample_values.slice(0, 10).reverse();
    let topOtuIds = otu_ids_str.slice(0, 10).reverse();
    let topOtuLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    let barData = {
      x: topSampleValues,
      y: topOtuIds,
      text: topOtuLabels,
      type: 'bar',
      orientation: 'h',
      hoverinfo: 'text'
    };

    let barLayout = {
      xaxis: {
        title: 'Number of Bacteria'
      },
      title: 'Top Ten Bacteria Cultures Found'
    };

    // Render the Bar Chart
    let barDiv = document.getElementById('barPlot');
    if (barDiv && barDiv._plotly === undefined) {
      Plotly.newPlot("barPlot", [barData], barLayout);
    } else {
      Plotly.react("barPlot", [barData], barLayout);
    }

  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  // Call buildMetadata with the selected sample
  buildMetadata(newSample);

  // Run functions to build metadata panel and charts
  buildCharts(newSample);

}


// Initialize the dashboard
init();
