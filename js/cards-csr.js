// Chase Sapphire Reserve benefit data only.
const CARDS = {
  csr:{name:'Chase Sapphire Reserve',fee:795,historicalFees:{2025:550},sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'c_dd_restaurant',name:'DoorDash Restaurant Credit',desc:'$5 promo for restaurant orders (DashPass required)',amount:5},
      {id:'c_dd_nonrest1',name:'DoorDash $10 Grocery Credit',desc:'$10 promo for grocery, convenience, etc',amount:10},
      {id:'c_dd_nonrest2',name:'DoorDash $10 Grocery Credit',desc:'$10 promo for grocery, convenience, etc',amount:10},
      {id:'c_lyft',name:'Lyft Credit',desc:'Monthly in-app credit for rides (through Sep 2027)',amount:10,startsFrom:2026},
      {id:'c_peloton',name:'Peloton Credit',desc:'Toward eligible Peloton memberships',amount:10,startsFrom:2026},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'c_dining',name:'Exclusive Tables Dining Credit',desc:'Via OpenTable Sapphire Reserve Exclusive Tables',amount:150,startsFrom:2026},
      {id:'c_stub',name:'StubHub / Viagogo Credit',desc:'Concert and event tickets',amount:150,startsFrom:2026},
    ]},
    {label:'Travel credit (Feb–Jan)',cadence:'feb-annual',benefits:[
      {id:'c_travel',name:'Travel Credit',desc:'Any travel purchase — automatic. Resets each February.',amount:300,partial:true},
    ]},
    {label:'Annual',cadence:'annual',benefits:[
      {id:'c_edit1',name:'The Edit Hotel Credit (1 of 2)',desc:'Prepaid 2-night+ stay via Chase Travel The Edit',amount:250,startsFrom:2026},
      {id:'c_edit2',name:'The Edit Hotel Credit (2 of 2)',desc:'Prepaid 2-night+ stay via Chase Travel The Edit',amount:250,startsFrom:2026},
      {id:'c_selecthotel',name:'Select Hotel Credit (2026 only)',desc:'IHG, Montage, Pendry, Omni, Virgin, Minor, Pan Pacific',amount:250,startsFrom:2026},
      {id:'c_apple',name:'Apple TV+ & Apple Music',desc:'Complimentary annual subscriptions — activate once via Chase (through Jun 2027)',amount:240,startsFrom:2026},
      {id:'c_ge',name:'Global Entry / TSA PreCheck / NEXUS',desc:'Statement credit every 4 years',amount:120},
    ]},
  ]}
};
