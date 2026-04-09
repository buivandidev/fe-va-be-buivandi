const fs = require('fs');
let s = fs.readFileSync('frontend/nguoi-dan/src/components/portal/PortalFooter.tsx', 'utf8');
let test = Buffer.from(s, 'utf8').toString('binary');
console.log(test.substring(900, 1500));
