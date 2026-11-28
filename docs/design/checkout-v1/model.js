// Review fixtures only. Never import into app/, components/, or transaction code.
const Demo = (() => {
  const products = {
    11: {name:"The Little Junker",price:325,tons:1,height:3,fit:"Garage, household or small remodel",photo:"11-yard-residential-driveway.jpg"},
    16: {name:"The Mighty Middler",price:375,tons:1.5,height:4.5,fit:"Several rooms, deck or remodel",photo:"16-yard-fayetteville-delivery.jpg"},
    21: {name:"The Big Junker",price:425,tons:2,height:6,fit:"Large cleanout or bulky debris",photo:"21-yard-driveway.jpg"}
  };
  const dates = ["2026-12-07","2026-12-08","2026-12-09","2026-12-10"];
  const locate = value => {
    const q=String(value||"").trim().toLowerCase();
    if (q==="30269") return {zip:q,city:"Peachtree City",fee:0};
    if (["30263","30265"].includes(q)) return {zip:q,city:"Newnan",fee:0};
    if (["peachtree city","newnan","atlanta"].includes(q)) return {city:q,fee:null,reason:"Enter the exact jobsite ZIP to check your fee."};
    return {fee:null,reason:q?"Location not verified in this example. Try 30269, 30263 or 30265.":"Enter your city or ZIP."};
  };
  const validDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value||"")) return false;
    const d=new Date(value+"T00:00:00Z");
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===value;
  };
  const available = (size,days,date) => !!products[size] && Number.isInteger(days) && days===3 && validDate(date) && dates.includes(date) && date!==dates[1] && !(size===21 && date===dates[2]);
  const price = state => {
    const product=products[state.size],area=locate(state.location),days=Number(state.days);
    const base=product?product.price:null;
    const known=base!==null && area.fee!==null && days===3;
    return {base,fee:area.fee,total:known?base+area.fee:null,days,quoteOnly:days>30,area};
  };
  const recommendation = project => ({garage:11,renovation:16,large:21}[project]||null);
  const canSchedule = state => !!products[state.size] && !!locate(state.location).zip;
  const canReview = state => canSchedule(state) && available(state.size,Number(state.days),state.date) && price(state).total!==null;
  return {products,dates,locate,validDate,available,price,recommendation,canSchedule,canReview};
})();