const names = [
  { first: 'Adeline', last: 'Aldren', role: 'Coordinator', location: 'Argentina' },
  { first: 'Bertram', last: 'Boskirk', role: 'Team Leader', location: 'Belgium' },
  { first: 'Callum', last: 'Corrigan', role: 'Facilitator', location: 'Canada' },
  { first: 'Daphne', last: 'Duvall', role: 'Implementer', location: 'Denmark' },
  { first: 'Eadwulf', last: 'Beckete', role: 'Implementer', location: 'Armenia' },
  { first: 'Everett', last: 'Emberton', role: 'Resource Investigator', location: 'Egypt' },
  { first: 'Florian', last: 'Farrow', role: 'Specialist', location: 'France' },
  { first: 'Griselda', last: 'Gantry', role: 'Monitor Evaluator', location: 'Georgia' },
  { first: 'Hazle', last: 'Hardwick', role: 'Teamworker', location: 'Algeria' },
  { first: 'Herman', last: 'Essertg', role: 'Co-ordinator', location: 'Andorra' },
  { first: 'Idris', last: 'Ingleton', role: 'Shaper', location: 'India' },
  { first: 'Josephine', last: 'Juxon', role: 'Plant', location: 'Japan' },
  { first: 'Keefe', last: 'Kestrel', role: 'Dynamic Operations Officer', location: 'Afghanistan' },
  { first: 'Lysandra', last: 'Loxley', role: 'Completer Finisher', location: 'Latvia' },
  { first: 'Midas', last: 'Mereworth', role: 'Leader', location: 'Australia' },
  { first: 'Menelaus', last: 'Marchbanks', role: 'Facilitator', location: 'Bahamas' },
  { first: 'Nolan', last: 'Norbury', role: 'Specialist', location: 'Norway' },
  { first: 'new', last: '', role: '', location: 'USA' },
  { first: 'Odalys', last: 'Orsden', role: 'Coordinator', location: 'Oman' },
  { first: 'Percival', last: 'Pemberton', role: 'Team Leader', location: 'Poland' },
  { first: 'Quillon', last: 'Quimby', role: 'Facilitator', location: 'Qatar' },
  { first: 'Rosalind', last: 'Rutherford', role: 'Implementer', location: 'Romania' },
  { first: 'Silas', last: 'Sedgwick', role: 'Resource Investigator', location: 'Spain' },
  { first: 'Uranus', last: 'Underhill', role: 'Facilitator', location: 'Austria' },
  { first: 'Valentina', last: 'Vayle', role: 'Monitor Evaluator', location: 'Vietnam' },
  { first: 'Wilhelmine', last: 'Durrg', role: 'Monitor Evaluator', location: 'Angola' },
  { first: 'Xiomara', last: 'Xylander', role: 'Shaper', location: 'Mexico' },
  { first: 'Yestin', last: 'Yardley', role: 'Plant', location: 'Yemen' },
  { first: 'Zachariah', last: 'Zephron', role: 'Completer Finisher', location: 'Zambia' },
]

export const contacts = names.map((n, idx) => ({
  id: idx + 1,
  firstName: n.first,
  lastName: n.last,
  name: n.last ? `${n.first} ${n.last}` : n.first,
  role: n.role,
  email: `${n.first.toLowerCase()}${n.last ? '_' + n.last.toLowerCase() : ''}_work@gmil.com`.replace(/\s+/g, ''),
  phone: `${200 + ((idx * 37) % 100)}-${(100 + ((idx * 53) % 900))}-${1000 + ((idx * 91) % 8999)}`,
  location: n.location,
  avatar: n.first === 'new' ? null : `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`,
}))

export const groupedContacts = () => {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name))
  const groups = {}
  sorted.forEach((c) => {
    const letter = c.name.charAt(0).toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(c)
  })
  return Object.keys(groups)
    .sort()
    .map((letter) => ({ letter, items: groups[letter] }))
}
