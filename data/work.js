/* The portfolio, from assets/Assets/OWLED_Diwali_Campaign_Views.xlsx. Web files are made by tools/convert-assets.sh.
   id       unique, used by clients.js picks
   cat      one of the stall ids in site.js (hooc, snoball, films, frontseat, origin)
   title    the work or campaign
   client   the brand
   views    the words shown on the card, as the sheet reports them; leave it out when the sheet has no number
   tall     true for 9:16 and 4:5 pieces, false for 16:9
   ...vid('x')  a video with a poster: assets/work/x.webm, x.mp4, x.webp
   ...pic('x')  an image: assets/work/x.webp
   Pieces without a file are left out, so the stalls only show work a guest can open.
   blurb    optional line in the viewer
   link     optional "watch it" button */
(() => {
const vid = id => ({ thumb: `assets/work/${id}.webp`, video: `assets/work/${id}` });
const pic = id => ({ thumb: `assets/work/${id}.webp` });

window.OWLED_WORK = [
  { id: 'hc-kivi', cat: 'hooc', title: 'Kivi by Sarvam', client: 'Kivi / Sarvam', tall: true, ...vid('hc-kivi') },
  { id: 'hc-zilo', cat: 'hooc', title: 'Zilo', client: 'Zilo', tall: false, ...vid('hc-zilo') },
  { id: 'hc-hero', cat: 'hooc', title: 'Hero Cycles', client: 'Hero Cycles', tall: true, ...vid('hc-hero') },
  { id: 'hc-district', cat: 'hooc', title: 'District', client: 'District', tall: true, ...vid('hc-district') },
  { id: 'hc-canva', cat: 'hooc', title: 'Canva', client: 'Canva', tall: true, ...vid('hc-canva') },
  { id: 'hc-allen', cat: 'hooc', title: 'ALLEN NEET Warriors', client: 'ALLEN', views: '232.5K views across 2 pieces', tall: true, ...vid('hc-allen') },

  { id: 'sb-100m-arr', cat: 'snoball', title: '$100M ARR', client: 'Emergent', views: '3.7M views', tall: false, ...vid('sb-emergent-100m-arr') },
  { id: 'sb-series-c', cat: 'snoball', title: 'Series C', client: 'Emergent', tall: false, ...vid('sb-emergent-series-c') },
  { id: 'sb-wispr', cat: 'snoball', title: 'Wispr Flow campaign', client: 'Wispr Flow', views: '35M+ campaign views', tall: false, ...vid('sb-wispr-flow') },

  { id: 'fl-juspay', cat: 'films', title: 'Apple Pay India Launch', client: 'Juspay / Apple Pay', tall: false, blurb: 'Delivered in one month.', ...vid('fl-juspay') },
  { id: 'fl-pixxel', cat: 'films', title: 'Pixxel Film', client: 'Pixxel', tall: false, ...vid('fl-pixxel') },
  { id: 'fl-openui', cat: 'films', title: 'OpenUI Film', client: 'OpenUI', tall: false, blurb: 'Delivered in 22 hours.', ...vid('fl-openui') },
  { id: 'fl-confido', cat: 'films', title: 'Confido Health Film', client: 'Confido Health', tall: false, blurb: 'Delivered in three days.', ...vid('fl-confido') },
  { id: 'fl-wazirx', cat: 'films', title: 'WazirX Film', client: 'WazirX', tall: false, ...vid('fl-wazirx') },

  { id: 'fs-socks', cat: 'frontseat', title: 'Socks Carving', client: 'Socks Carving', views: '153K views', tall: true, ...pic('fs-socks') },
  { id: 'fs-razorpay', cat: 'frontseat', title: 'Razorpay', client: 'Razorpay', views: '151K views', tall: true, ...pic('fs-razorpay') },
  { id: 'fs-upasana', cat: 'frontseat', title: 'Upasana Kamineni', client: 'Upasana Kamineni', views: '172K views', tall: true, ...pic('fs-upasana') },
  { id: 'fs-ultraviolette', cat: 'frontseat', title: 'Ultraviolette', client: 'Ultraviolette', views: '52K views', tall: true, ...pic('fs-ultraviolette') },
  { id: 'fs-lit', cat: 'frontseat', title: 'LIT School x Aman', client: 'LIT School', views: '106K views', tall: true, ...pic('fs-lit') },
  { id: 'fs-foundery', cat: 'frontseat', title: 'The Foundery', client: 'The Foundery', views: '225K views', tall: true, ...pic('fs-foundery') },
  { id: 'fs-tata', cat: 'frontseat', title: 'Tata Sons', client: 'Tata Sons', views: '99K views', tall: true, ...pic('fs-tata') },
  { id: 'fs-priyagold', cat: 'frontseat', title: 'Priyagold / Salesforce', client: 'Priyagold / Salesforce', tall: true, ...pic('fs-priyagold') },

  { id: 'or-senco', cat: 'origin', title: 'Everlite by Senco', client: 'Senco', tall: false, ...vid('or-senco') },
  { id: 'or-supermoney', cat: 'origin', title: 'super.money x Rebel Kid', client: 'super.money', tall: true, ...vid('or-supermoney') },
  { id: 'or-zomato', cat: 'origin', title: 'Mathi Means More: Onam', client: 'Zomato', views: '5.1M campaign views', tall: false, ...vid('or-zomato') },
  { id: 'or-wispr', cat: 'origin', title: 'Bologe Toh Tum Dikhoge', client: 'Wispr Flow', views: '8M+ campaign views', tall: true, ...pic('or-wispr') },
  { id: 'or-hero', cat: 'origin', title: "Achiever's Quest", client: 'Hero Cycles', views: '9.6M+ campaign views', tall: false, blurb: 'Three brand reels plus an aftermovie.', ...vid('or-hero') },
];
})();
