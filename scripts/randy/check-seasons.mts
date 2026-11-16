import { randyVariantFor } from "../../lib/randy-season.ts";
const cases: [number,number,number,string][] = [
 [2026,12,31,"new-year"],[2027,1,2,"new-year"],[2027,1,3,"default"],[2027,2,14,"valentines"],[2027,3,17,"st-patricks"],
 [2027,5,29,"memorial-day"],[2027,5,31,"memorial-day"],[2027,5,28,"default"],[2026,5,25,"memorial-day"],
 [2027,7,4,"independence-day"],[2027,10,31,"halloween"],[2027,11,11,"veterans-day"],
 [2026,11,23,"thanksgiving"],[2026,11,26,"thanksgiving"],[2026,11,27,"thanksgiving"],[2026,11,22,"default"],[2027,11,25,"thanksgiving"],
 [2026,12,1,"christmas"],[2026,12,26,"christmas"],[2026,12,27,"default"],[2026,11,16,"default"]];
let bad=0; for (const [y,m,d,want] of cases){const got=randyVariantFor({y,m,d}); if(got!==want){bad++;console.log("FAIL",y,m,d,got,"want",want);}}
if (bad) { console.log(`${bad} failed`); process.exit(1); } console.log(`Randy holiday dates: all ${cases.length} checks pass`);
