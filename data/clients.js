/* The personal note waiting at the end of the lane. Link: index.html?name=Riya&c=acme
   The key after c= can be a company or one person (riya-acme), so each guest can get their own note.
   - note: what they read. {name} becomes their first name.
   - picks: work ids (from work.js) listed on the note as "Made for you".
   A link without ?c= still gets a note: the general one in site.js (copy.noteFallback). */
window.OWLED_CLIENTS = {
  acme: {
    company: 'Acme Foods',
    note: 'from the first reel to the 4M-view festive film: thank you for saying yes to the wild ideas.',
    picks: ['w03', 'w08', 'w15'],
  },
  zest: {
    company: 'Zest Beauty',
    note: 'twelve creators, one launch week, zero sleep. worth it.',
    picks: ['w19', 'w20', 'w24'],
  },
};
