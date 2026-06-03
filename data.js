// LinkFlow AI — App Data (no dummy connections)

const NOTIFICATIONS = [
  { id:1, text:"Welcome to LinkFlow AI! Import your LinkedIn connections to get started.", time:"Just now", icon:"👋", read:false },
  { id:2, text:"Tip: Use the Import page to add your LinkedIn profile URL and connection count.", time:"Just now", icon:"💡", read:false },
];

const ALL_TAGS = ["Internship","Job Referral","Startup","Mentor","Freelancer","Investor","Content Creator"];

let state = {
  user: null,
  connections: [],        // starts empty — populated by import
  dailyContacts: [],
  dailyContactsDate: null,
  notifications: [...NOTIFICATIONS],
  selectedContact: null,
  importedCount: 0,
};
