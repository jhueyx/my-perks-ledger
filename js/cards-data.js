// Supported card benefit data. Visibility is controlled by Supabase user_profiles.cards.
const CARDS={
  gold:{name:'AMEX Gold',fee:325,historicalFees:{2025:325},sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'g_dining',name:'Dining Credit',desc:'Grubhub, Cheesecake Factory, Five Guys, BWW, Wonder',amount:10},
      {id:'g_uber',name:'Uber Cash',desc:'Uber rides or Uber Eats in the US',amount:10},
      {id:'g_dunkin',name:"Dunkin' Credit",desc:"At U.S. Dunkin' locations",amount:7},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'g_resy',name:'Resy Dining Credit',desc:'Any U.S. Resy restaurant — no reservation required',amount:50},
    ]},
    {label:'Annual',cadence:'annual',benefits:[
      {id:'g_hotel',name:'Hotel Collection Credit',desc:'$100 on eligible charges, 2-night min via AMEX Travel',amount:100,partial:true},
    ]},
  ]},
  platinum:{name:'AMEX Platinum',fee:895,historicalFees:{2025:695},sections:[
    {label:'Monthly',cadence:'monthly',benefits:[
      {id:'p_uber',name:'Uber Cash',desc:'$15/mo · $35 in December',amount:15,decAmount:35},
      {id:'p_digital',name:'Digital Entertainment',desc:'Disney+, Hulu, ESPN+, Peacock, Paramount+, NYT, WSJ, YouTube',amount:25},
      {id:'p_walmart',name:'Walmart+ Credit',desc:'Covers monthly Walmart+ membership',amount:12.95},
    ]},
    {label:'Quarterly',cadence:'quarterly',benefits:[
      {id:'p_resy',name:'Resy Dining Credit',desc:'At eligible U.S. Resy restaurants',amount:100,startsFrom:2026},
      {id:'p_lulu',name:'Lululemon Credit',desc:'U.S. stores or lululemon.com',amount:75,startsFrom:2026},
    ]},
    {label:'Semi-annual (card-year)',cadence:'semi-annual',benefits:[
      {id:'p_hotel',name:'Hotel Credit',desc:'Fine Hotels + Resorts or Hotel Collection, 2-night min',amount:300},
    ]},
    {label:'Semi-annual (calendar)',cadence:'cal-semi-annual',benefits:[
      {id:'p_saks',name:'Saks Fifth Avenue',desc:'At Saks stores or saks.com — resets Jan & Jul. Ends Jun 2026.',amount:50,expiresAfter:{y:2026,h:0}},
    ]},
    {label:'Annual (calendar year)',cadence:'cal-annual',benefits:[
      {id:'p_uberone',name:'Uber One Membership Credit',desc:'One-time credit for annual Uber One membership',amount:96,startsFrom:2026},
      {id:'p_airline',name:'Airline Fee Credit',desc:'Incidental fees with one selected airline',amount:200,partial:true},
      {id:'p_equinox',name:'Equinox Credit',desc:'Equinox club or app membership',amount:300,partial:true},
      {id:'p_oura',name:'Oura Ring Credit',desc:'Hardware only via OURAring.com',amount:200,startsFrom:2026},
      {id:'p_ge',name:'Global Entry / TSA PreCheck',desc:'Statement credit every 4 years',amount:120},
      {id:'p_clear',name:'CLEAR Plus Credit',desc:'Annual CLEAR Plus membership',amount:189},
    ]},
  ]},
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
  ]},
};
