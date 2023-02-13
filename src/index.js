/*
 * LightningChartJS example that showcases creation of a grouped bars chart.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    emptyLine,
    AutoCursorModes,
    UIOrigins,
    LegendBoxBuilders,
    AxisScrollStrategies,
    AxisTickStrategies,
    UIElementBuilders,
    Themes,
} = lcjs

const lc = lightningChart()

// Define an interface for creating vertical bars.
let barChart
{
    barChart = (options) => {
        const figureThickness = 10
        const figureGap = figureThickness * 0.25
        const groupGap = figureGap * 3.0
        const groups = []
        const categories = []

        // Create a XY-Chart and add a RectSeries to it for rendering rectangles.
        const chart = lc
            .ChartXY(options)
            .setTitle('Grouped Bars (Employee Count)')
            .setAutoCursorMode(AutoCursorModes.onHover)
            // Disable mouse interactions (e.g. zooming and panning) of plotting area
            .setMouseInteractions(false)
            // Temporary fix for library-side bug. Remove after fixed.
            .setPadding({ bottom: 30 })

        // X-axis of the series
        const axisX = chart
            .getDefaultAxisX()
            .setMouseInteractions(false)
            .setScrollStrategy(undefined)
            // Disable default ticks.
            .setTickStrategy(AxisTickStrategies.Empty)

        // Y-axis of the series
        const axisY = chart
            .getDefaultAxisY()
            .setMouseInteractions(false)
            .setTitle('Number of Employees')
            .setInterval({ start: 0, end: 70, stopAxisAfter: false })
            .setScrollStrategy(AxisScrollStrategies.fitting)

        // cursor
        //#region
        // Modify AutoCursor.
        chart.setAutoCursor((cursor) =>
            cursor
                .setPointMarkerVisible(false)
                .setTickMarkerXVisible(false)
                .setTickMarkerYVisible(false)
                .setGridStrokeXStyle(emptyLine)
                .setGridStrokeYStyle(emptyLine)
                .setResultTable((table) => {
                    table.setOrigin(UIOrigins.CenterBottom)
                }),
        )
        // Define function that creates a Rectangle series (for each category), that adds cursor functionality to it
        const createSeriesForCategory = (category) => {
            const series = chart.addRectangleSeries().setDefaultStyle((rect) => rect.setStrokeStyle(emptyLine))
            // Change how marker displays its information.
            series.setCursorResultTableFormatter((builder, series, figure) => {
                // Find cached entry for the figure.
                let entry = {
                    name: category.name,
                    value: category.data[category.figures.indexOf(figure)],
                }
                // Parse result table content from values of 'entry'.
                return builder.addRow('Department:', entry.name).addRow('# of employees:', String(entry.value))
            })
            return series
        }
        //#endregion
        // LegendBox
        //#region
        const legendBox = chart
            .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
            // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
            .setAutoDispose({
                type: 'max-width',
                maxWidth: 0.2,
            })
            .setTitle('Department')

        //#endregion
        // Function redraws bars chart based on values of 'groups' and 'categories'
        const redraw = () => {
            let x = 0
            for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                const group = groups[groupIndex]
                const xStart = x
                for (const category of categories) {
                    const value = category.data[groupIndex]
                    if (value !== undefined) {
                        // Position figure of respective value.
                        const figure = category.figures[groupIndex]
                        figure.setDimensions({
                            x,
                            y: 0,
                            width: figureThickness,
                            height: value,
                        })
                        // Figure gap
                        x += figureThickness + figureGap
                    }
                }
                // Position CustomTick
                group.tick.setValue((xStart + x - figureGap) / 2)

                // Group gap
                x += groupGap
            }
            axisX.setInterval({ start: -(groupGap + figureGap), end: x, stopAxisAfter: false })
        }
        const addGroups = (names) => {
            for (const name of names)
                groups.push({
                    name,
                    tick: axisX
                        .addCustomTick()
                        .setGridStrokeLength(0)
                        .setTextFormatter((_) => name),
                })
        }
        const addCategory = (entry) => {
            // Each category has its own series.
            const series = createSeriesForCategory(entry).setName(entry.name)
            entry.figures = entry.data.map((value) => series.add({ x: 0, y: 0, width: 0, height: 0 }))
            legendBox.add(series)
            categories.push(entry)
            redraw()
        }
        // Return public methods of a bar chart interface.
        return {
            addCategory,
            addGroups,
        }
    }
}

// Use bar chart interface to construct series
const chart = barChart({
    // theme: Themes.darkGold
})

// Add groups
chart.addGroups(['Finland', 'Germany', 'UK'])

// Add categories of bars
const categories = ['Engineers', 'Sales', 'Marketing']
const data = [
    [48, 27, 24],
    [19, 40, 14],
    [33, 33, 62],
]
data.forEach((data, i) =>
    chart.addCategory({
        name: categories[i],
        data,
    }),
)
