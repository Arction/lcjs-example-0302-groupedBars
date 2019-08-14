/**
 * LightningChartJS example that showcases creation of a grouped bars chart.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    SolidFill,
    ColorRGBA,
    emptyLine,
    emptyFill,
    emptyTick,
    AutoCursorModes,
    ColorPalettes,
    UIOrigins,
    LegendBoxBuilders,
    AxisScrollStrategies
} = lcjs

const lc = lightningChart()

// Define an interface for creating vertical bars.
let barChart
{
    barChart = (options) => {
        const figureThickness = 10
        const figureGap = figureThickness * .25
        const groupGap = figureGap * 3.0
        const groups = []
        const categories = []

        // Create a XY-Chart and add a RectSeries to it for rendering rectangles.
        const chart = lc.ChartXY(options)
            .setTitle('Grouped Bars (Employee Count)')
            .setAutoCursorMode(AutoCursorModes.onHover)
            // Disable mouse interactions (e.g. zooming and panning) of plotting area
            .setMouseInteractions(false)
            // Temporary fix for library-side bug. Remove after fixed.
            .setPadding({ bottom: 30 })

        // X-axis of the series
        const axisX = chart.getDefaultAxisX()
            .setMouseInteractions(false)
            .setScrollStrategy(undefined)
            // Disable default ticks.
            .setTickStyle(emptyTick)

        // Y-axis of the series
        const axisY = chart.getDefaultAxisY()
            .setMouseInteractions(false)
            .setTitle('Number of Employees')
            .setInterval(0, 70)
            .setScrollStrategy(AxisScrollStrategies.fitting)

        // cursor
        //#region
        // Show band using Rectangle series.
        const band = chart.addRectangleSeries()
            .setCursorEnabled(false)
            .add({ x: 0, y: 0, width: 0, height: 0 })
            .setFillStyle(new SolidFill().setColor(ColorRGBA(255, 255, 255, 50)))
            .setStrokeStyle(emptyLine)
            .setMouseInteractions(false)
            .dispose()
        // Modify AutoCursor.
        chart.setAutoCursor(cursor => cursor
            .disposePointMarker()
            .disposeTickMarkerX()
            .disposeTickMarkerY()
            .setGridStrokeXStyle(emptyLine)
            .setGridStrokeYStyle(emptyLine)
            .setResultTable((table) => {
                table
                    .setOrigin(UIOrigins.CenterBottom)
            })
        )
        // Define function that creates a Rectangle series (for each category), that adds cursor functionality to it
        const createSeriesForCategory = (category) => {
            const series = chart.addRectangleSeries()
            // Change how marker displays its information.
            series.setResultTableFormatter((builder, series, figure) => {
                // Find cached entry for the figure.
                let entry = {
                    name: category.name,
                    value: category.data[category.figures.indexOf(figure)]
                }
                // Parse result table content from values of 'entry'.
                return builder
                    .addRow('Department:', entry.name)
                    .addRow('# of employees:', String(entry.value))
            })
            // Apply cursor logic using series.onHover method
            series.onHover((_, point) => {
                if (point) {
                    const figure = point.figure
                    const dimensions = figure.getDimensionsPositionAndSize()
                    // Show band.
                    band
                        .setDimensions({
                            x: dimensions.x - figureGap * .5,
                            y: figure.scale.y.getInnerStart(),
                            width: dimensions.width + figureGap,
                            height: figure.scale.y.getInnerInterval()
                        })
                        .restore()
                } else
                    band.dispose()
            })
            return series
        }
        //#endregion
        // LegendBox
        //#region
        const margin = 4
        const legendBox = chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
            .setPosition({ x: 15, y: 90 })
            .setOrigin(UIOrigins.LeftTop)
            .setMargin(margin)

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
                            height: value
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
            axisX.setInterval(-(groupGap + figureGap), x)
        }
        const addGroups = (names) => {
            for (const name of names)
                groups.push({
                    name,
                    tick: axisX.addCustomTick()
                        .setGridStrokeLength(0)
                        .setTextFormatter((_) => name)
                        .setMarker((marker) => marker
                            .setBackground((background) => background
                                .setFillStyle(emptyFill)
                                .setStrokeStyle(emptyLine)
                            )
                        )
                })
        }
        const addCategory = (entry) => {
            // Each category has its own series.
            const series = createSeriesForCategory(entry)
                .setName(entry.name)
                .setDefaultStyle(figure => figure.setFillStyle(entry.fill))
            entry.figures = entry.data.map((value) => series.add({ x: 0, y: 0, width: 0, height: 0 }))
            legendBox.add(series, 'Legend')
            categories.push(entry)
            redraw()
        }
        // Return public methods of a bar chart interface.
        return {
            addCategory,
            addGroups
        }
    }
}

// Use bar chart interface to construct series
const chart = barChart()

// Add groups
chart.addGroups(['Finland', 'Germany', 'UK'])

// Add categories of bars
const categories = ['Engineers', 'Sales', 'Marketing']
const palette = ColorPalettes.arctionWarm(categories.length)
const fillStyles = categories.map((_, i) => new SolidFill({ color: palette(i) }))
const data = [
    [48, 27, 24],
    [19, 40, 14],
    [33, 33, 62]
]
data.forEach((data, i) =>
    chart.addCategory({
        name: categories[i],
        data,
        fill: fillStyles[i]
    })
)