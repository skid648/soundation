let chartData = [
  {
    originator: 'Visually impaired',
    balance: 372.27,
    fake: 0,
    color: 'darkcyan',
  },
  {
    originator: 'Visually impaired using web',
    balance: 92.53,
    fake: 0,
    color: '#FC3A51',
  },
];

function type(d) {
  d.balance = +d.balance;
  return d;
}

function swapRealData(data) {
  for (i = 0; i < data.length; i++) {
    data[i].fake = data[i].balance;
  }

  return data;
}

chartData = chartData.slice(0, 9);

const chartWidth = 450
const chartHeight = 300
const radius = Math.min(chartWidth, chartHeight) / 2
const that = this
const w = 200
const h = 50
const colorObj = []

const color = d3.scale.category20();

const arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);

const pie = d3.layout.pie().sort(d3.descending).value(d => d.fake);

const svg = d3.select('body').select('.viz-portfolio-total-value').append('svg').attr('chartWidth', chartWidth)
  .attr('height', chartHeight)
  .append('g')
  .attr('transform', `translate(${150},${chartHeight / 2})`);

const g = svg.selectAll('.arc').data(pie(chartData)).enter().append('g')
  .attr('class', 'arc');

g.append('path').attr('d', arc).style('fill', d => d.data.color).each(function (d) {
  this._current = d;
}); // store the initial values;

function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function (t) {
    return arc(i(t));
  };
}

function redrawChart() {
  // Convert 'fake' value to real value then animate updated chart 
  that.swapRealData(chartData);
  svg.selectAll('path').data(pie(chartData)).transition().duration(2000)
    .attrTween('d', arcTween);

  svg.selectAll('.arc').data(pie(chartData));

  // Delay 
  window.setTimeout(() => {
    g.append('text').attr('transform', d => `translate(${arc.centroid(d)})`);
  }, 1800);
}

window.setTimeout(redrawChart, 500);
