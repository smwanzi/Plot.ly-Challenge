// Dropdown Select Sample panel
function init() {
  // Sample element Selector
  var selector = d3.select("#selDataset");
  
  // Load samples.json file using d3 library
    d3.json("samples.json").then((data) => {
      console.log(data);
      // Get OTU ID's from Sample Names into the dropdown
      var otu_ids = data.names;
      otu_ids.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
      });
  // Use the first sample ID from the names to build the initial plots
    const firstSample = otu_ids[0];
    buildCharts(firstSample);
    demoMetadata(firstSample);
    });
  }   
  // Demographic Info panel  
function demoMetadata(sample) {
  d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // console.log(metadata);
      // filter meta data info by id
      var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = filterArray[0];
      console.log(result)
      // select demographic panel to input data
      var metaPanel = d3.select("#sample-metadata");
      // clear demographic info panel b4 next selection
      metaPanel.html("");
      // grab demographic data for selected id & append to panel
      Object.entries(result).forEach(([key, value]) => {
          metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
      })
    // Create gaugeChart function
    gaugeChart(result.wfreq)

    });
}
  // BONUS: Build the Gauge Chart
function gaugeChart(wfreq) {
  // Enter a speed between 0 and 180
  var degree = parseInt(wfreq) * (180/10);
   
  var level = degree;

  // Trig to calc meter point
  var degrees = 180 - level,
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'WASH FREQ',
      text: wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)', 
              'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
              'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
              'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
              'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
              ]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],

    title: '<b> Belly Button Washing Frequency</b> <br> Scrub Per Week',
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };
  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, trace, layout, {responsive: true});
}
  // Build charts
function buildCharts(sample) {    
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterArray[0];
  var sample_values = result.sample_values;
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels; 
  // Bar Chart
  var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      name: "Greek",
      type: "bar",
      orientation: "h"
  };
  var data = [trace1];
  var layout = {
      title: "Top Ten OTUs for Individual " +sample,
      margin: {l: 100, r: 100, t: 100, b: 100}
  };
  Plotly.newPlot("bar", data, layout);  

 // Bubble Chart
  var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale:"Rainbow"
      }
  };
  var data = [trace1];
  var layout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
      margin: {t:30}
  };
  Plotly.newPlot('bubble', data, layout); 
  });
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  demoMetadata(newSample);
}
// Initialize the dashboard
init();