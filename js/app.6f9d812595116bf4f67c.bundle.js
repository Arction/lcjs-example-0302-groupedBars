(self.webpackChunk=self.webpackChunk||[]).push([[524],{44:(e,t,s)=>{const a=s(89),{lightningChart:r,AxisTickStrategies:o,LegendBoxBuilders:i,AxisScrollStrategies:l,BarChartSorting:n,Themes:u}=a,d=r().BarChart({}).setTitle("Grouped Bars (Employee Count)").setValueLabels(void 0).setCursorResultTableFormatter(((e,t,s,a)=>(e.addRow("Department:",a.subCategory).addRow("# of employees:",String(s)),e)));d.setDataGrouped(["Finland","Germany","UK"],[{subCategory:"Engineers",values:[48,27,24]},{subCategory:"Sales",values:[19,40,14]},{subCategory:"Marketing",values:[33,33,62]}]).setSorting(n.None).set,d.valueAxis.setTitle("Number of Employees"),d.addLegendBox(i.VerticalLegendBox).setAutoDispose({type:"max-width",maxWidth:.2}).setTitle("Department").add(d)}},e=>{e.O(0,[502],(()=>(44,e(e.s=44)))),e.O()}]);