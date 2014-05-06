var process = {};

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
  "ASSESSING_AGENCY",
  "Office of Civil Defense",
  "Office of the President",
  "Department of Budget and Management"
])

process.levelDict = m.prop([
  "RECEIVED",
  "ASSESSOR_ASSIGNMENT",
  "ASSESSOR_SIGNOFF",
  "OCD_SIGNOFF",
  "OP_SIGNOFF",
  "SARO_ASSIGNMENT"
])

// process.titles = m.prop([
//   "MAYOR",
//   "CONG",
//   "GOV",
//   "USEC",
// ])