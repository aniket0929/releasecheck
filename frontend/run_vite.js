import { exec } from 'child_process';
exec('npx vite build', (err, stdout, stderr) => {
  if (err) {
    console.log("ERR:", err.message);
    console.log("STDERR:", stderr);
    console.log("STDOUT:", stdout);
  } else {
    console.log("SUCCESS!");
  }
});
