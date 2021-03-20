const chartValues = [{value: 25},{value: 60},{value: 45},{value: 50},{value: 40}]

function formatLineChartData(values, chartHeight) {

    //divide chart size by total number of points to get length of triangle base. That becomes the left offset for each new point
    //subtract previous point height from new point height to get the rise of the triangle. That becomes the bottom offset for the new point.
    //use base squared + rise squared to find the length of the hypotenuse. That becomes the width of the line to draw.
    //use Math.asin(base / hypotenuse) [then convert the radians to degrees] to find the degree angle to rotate the line to.
    //Multiply the rotation angle by -1 if it needs to rise to meet the next point.
    
    const widgetSize = chartHeight;
    const pointSize = 16;

    const base = (widgetSize - pointSize / 2 ) / values.length;

    let sortedValues = sortValues([...values]);

    const topMostPoint = sortedValues[0].value;
    let leftOffset = pointSize; //padding for left axis labels
    let nextPoint = 0;
    let rise = 0;
    let cssValues = [];

    for (var i=0, len=values.length-1; i<len; i++) {

        var currentValue = {
        left: 0,
        bottom: 0,
        hypotenuse: 0,
        angle: 0,
        value: 0
        };

        currentValue.value = values[i].value;
        currentValue.left = leftOffset;
        leftOffset += base;

        currentValue.bottom = (widgetSize - pointSize) * (currentValue.value / topMostPoint);
        nextPoint = (widgetSize - pointSize) * (values[i+1].value / topMostPoint);

        rise = currentValue.bottom - nextPoint;
        currentValue.hypotenuse = Math.sqrt((base * base) + (rise * rise));
        currentValue.angle = radiansToDegrees(Math.asin(rise / currentValue.hypotenuse));

        cssValues.push(currentValue);
    }

    var lastPoint = {
        left: leftOffset,
        bottom: (widgetSize - pointSize) * (values[values.length - 1].value / topMostPoint),
        hypotenuse: 0,
        angle: 0,
        value: values[values.length - 1].value
    };

    cssValues.push(lastPoint);

    return cssValues;
}

const sortValues = values => values.sort((a, b) => b.value - a.value)
    
const radiansToDegrees = (rads) => rads * (180 / Math.PI)

const sum = (total, value) => total + value.value


function render(data, container) {
    data.forEach((item) => {
        let markup = createListItem(item);
        let listItem = document.createElement("li");
        listItem.style.cssText = `--x: ${item.left}px; --y: ${item.bottom}px`;
        listItem.innerHTML = markup;
        container.appendChild(listItem);
    });
}

function createListItem(item) {
    return `
    <div class="data-point" data-value="${item.value}"></div>
    <div class="line-segment" style="--hypotenuse: ${item.hypotenuse}; --angle:${item.angle};"></div>
    `;
}

render(formatLineChartData(chartValues, 200), document.getElementById('line-chart'))