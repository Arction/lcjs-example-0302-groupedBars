(self.webpackChunk=self.webpackChunk||[]).push([[524],{44:(e,a,s)=>{const t=s(377),{lightningChart:r,AxisTickStrategies:o,LegendBoxBuilders:n,AxisScrollStrategies:i,BarChartSorting:l,Themes:d}=t,u=r({resourcesBaseUrl:new URL(document.head.baseURI).origin+new URL(document.head.baseURI).pathname+"resources/"}).BarChart({theme:d[new URLSearchParams(window.location.search).get("theme")||"darkGold"]||void 0}).setTitle("Grouped Bars (Employee Count)").setValueLabels(void 0);u.setDataGrouped(["Finland","Germany","UK"],[{subCategory:"Engineers",values:[48,27,24]},{subCategory:"Sales",values:[19,40,14]},{subCategory:"Marketing",values:[33,33,62]}]).setSorting(l.None).set,u.valueAxis.setTitle("Number of Employees"),u.addLegendBox(n.VerticalLegendBox).setAutoDispose({type:"max-width",maxWidth:.2}).setTitle("Department").add(u)}},e=>{e.O(0,[502],(()=>e(e.s=44))),e.O()}]);