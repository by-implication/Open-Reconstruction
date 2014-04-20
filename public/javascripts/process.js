var process = {};

process.steps = m.prop({
  5: "Creation", 
  10: "Assessment", 
  20: "OCD Endorsement", 
  30: "Presidential Approval",
  40: "Budget Allocation"
});

process.permissions = m.prop({
  "LGU": [5],
  "GOCC": [5],
  "NGA": [5], // clarify with stella
  "OCD": [20],
  "DPWH": [10],
  "DBM": [40],
  "OP": [30]
});

process.rolePermissions = m.prop({
  "1": "CREATE_REQUESTS",
  "2": "VALIDATE_REQUESTS",
  "3": "EDIT_REQUESTS",
  "4": "IMPLEMENT_REQUESTS",
  "5": "SIGNOFF",
  "6": "ASSIGN_FUNDING",
})

process.levelToAgencyName = m.prop([
  "ASSESSING_AGENCY",
  "Office of Civil Defense",
  "Office of the President",
  "Department of Budget and Management"
])

// process.titles = m.prop([
//   "MAYOR",
//   "CONG",
//   "GOV",
//   "USEC",
// ])