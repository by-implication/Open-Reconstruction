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